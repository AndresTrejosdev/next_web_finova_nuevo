import { NextRequest, NextResponse } from 'next/server';
import { validateCriticalEnvVars, getUrls } from '@/lib/env-validator';
import { axiosWithRetry } from '@/lib/api-retry';
import axios from 'axios';

/**
 * 🏥 ENDPOINT DE SALUD DEL SISTEMA
 * 
 * Verifica que todas las integraciones estén funcionando
 * URL: GET /api/health
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Iniciando verificación de salud del sistema...');
    
    // 1. Verificar variables de entorno
    let envStatus = 'ERROR';
    let envDetails = {};
    
    try {
      const urls = validateCriticalEnvVars();
      envStatus = 'OK';
      envDetails = {
        apiUrl: urls.NEXT_PUBLIC_API_URL,
        panelUrl: urls.NEXT_PUBLIC_PANEL_URL,
        payvalidaApi: urls.NEXT_PUBLIC_PAYVALIDA_API,
        gopagosApi: urls.NEXT_PUBLIC_GOPAGOS_API,
        returnUrl: urls.NEXT_PUBLIC_RETURN_URL,
        cancelUrl: urls.NEXT_PUBLIC_CANCEL_URL
      };
    } catch (error: any) {
      envDetails = { error: error.message };
    }

    // 2. Verificar conectividad con API principal
    let apiStatus = 'ERROR';
    let apiDetails = {};
    
    try {
      if (envStatus === 'OK') {
        const urls = getUrls();
        const response = await axiosWithRetry(
          { method: 'GET', url: `${urls.apiUrl}/health` },
          { retries: 1, timeout: 8000, retryDelay: 500 }
        );
        apiStatus = response.status === 200 ? 'OK' : 'ERROR';
        apiDetails = { 
          status: response.status, 
          responseTime: `${Date.now() - startTime}ms` 
        };
      }
    } catch (error: any) {
      apiDetails = { 
        error: error.message,
        code: error.code
      };
    }

    // 3. Verificar Panel
    let panelStatus = 'ERROR';
    let panelDetails = {};
    
    try {
      if (envStatus === 'OK') {
        const urls = getUrls();
        const response = await axios.get(`${urls.panelUrl}/health`, { timeout: 5000 });
        panelStatus = response.status === 200 ? 'OK' : 'ERROR';
        panelDetails = { 
          status: response.status,
          responseTime: `${Date.now() - startTime}ms`
        };
      }
    } catch (error: any) {
      panelDetails = { 
        error: error.message,
        code: error.code
      };
    }

    // 4. Verificar PayValida
    let payvalidaStatus = 'ERROR';
    let payvalidaDetails = {};
    
    try {
      if (envStatus === 'OK') {
        const urls = getUrls();
        const response = await axios.get(`${urls.payvalidaApi}/health`, { timeout: 5000 });
        payvalidaStatus = response.status === 200 ? 'OK' : 'WARNING';
        payvalidaDetails = { 
          status: response.status,
          responseTime: `${Date.now() - startTime}ms`
        };
      }
    } catch (error: any) {
      payvalidaDetails = { 
        error: error.message,
        code: error.code
      };
    }

    // 5. Verificar GoPagos  
    let gopagosStatus = 'ERROR';
    let gopagosDetails = {};
    
    try {
      if (envStatus === 'OK') {
        const urls = getUrls();
        const response = await axios.get(`${urls.gopagosApi}/health`, { timeout: 5000 });
        gopagosStatus = response.status === 200 ? 'OK' : 'WARNING';
        gopagosDetails = { 
          status: response.status,
          responseTime: `${Date.now() - startTime}ms`
        };
      }
    } catch (error: any) {
      gopagosDetails = { 
        error: error.message,
        code: error.code
      };
    }

    // Determinar estado general
    const allStatuses = [envStatus, apiStatus, panelStatus];
    const criticalOk = allStatuses.every(s => s === 'OK');
    const overallStatus = criticalOk ? 'HEALTHY' : 'DEGRADED';

    const healthReport = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${Date.now() - startTime}ms`,
      services: {
        environment: {
          status: envStatus,
          details: envDetails
        },
        api: {
          status: apiStatus,
          details: apiDetails,
          critical: true
        },
        panel: {
          status: panelStatus,  
          details: panelDetails,
          critical: true
        },
        payvalida: {
          status: payvalidaStatus,
          details: payvalidaDetails,
          critical: false
        },
        gopagos: {
          status: gopagosStatus,
          details: gopagosDetails,
          critical: false
        }
      },
      checks: {
        environmentVariables: envStatus === 'OK',
        apiConnectivity: apiStatus === 'OK',
        panelConnectivity: panelStatus === 'OK',
        paymentGateways: payvalidaStatus === 'OK' || gopagosStatus === 'OK'
      }
    };

    console.log('✅ Verificación de salud completada:', {
      status: overallStatus,
      responseTime: healthReport.responseTime,
      criticalServices: criticalOk
    });

    return NextResponse.json(healthReport, { 
      status: overallStatus === 'HEALTHY' ? 200 : 503 
    });

  } catch (error: any) {
    console.error('❌ Error en verificación de salud:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    }, { status: 500 });
  }
}