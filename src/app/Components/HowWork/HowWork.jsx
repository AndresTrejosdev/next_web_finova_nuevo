import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";

const HowWork = () => {
    return (
        <section className="work-process-section section-padding fix">
            <div className="work-process-container-wrapper style1">
                <div className="container">
                    <div className="section-title text-center mxw-565 mx-auto">
                        <SectionTitle
                            SubTitle="+5000 personas nos eligieron"
                            Title="Somos tu aliado financiero"
                        ></SectionTitle>
                    </div>
                    <div className="work-process-wrapper style1">
                        
                        <div className="row">
                            <div className="col-xl-4">
                                <div className="work-process-box style1 wow fadeInUp" data-wow-delay=".2s">
                                    <div className="step"></div>
                                    <div className="title">Desembolso en 24 horas</div>
                                    <div className="text">Bancolombia, Nequi, Davivienda, Daviplata, BBVA, AV Villas, otras.</div>
                                </div>
                            </div>
                            <div className="col-xl-4">
                                <div className="work-process-box style1 child2 wow fadeInUp" data-wow-delay=".4s">
                                    <div className="step"></div>
                                    <div className="title">Tus creditos en linea</div>
                                    <div className="text">Solo necesitas conexion a internet y anexar tus datos personales.</div>
                                </div>
                            </div>
                            <div className="col-xl-4">
                                <div className="work-process-box style1 wow fadeInUp" data-wow-delay=".6s">
                                    <div className="step"></div>
                                    <div className="title">Apoyo personalizado</div>
                                    <div className="text">Atención de asesores certificados, sin bots, solo atención humana.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowWork;