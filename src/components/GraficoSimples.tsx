interface GraficoProps {
    percentage?: number;
    changeText?: string;
}

export default function GraficoSimples({
    percentage = 69,
    changeText = "-1%",
}: GraficoProps) {
    // Configurações do arco (raio 50 = circunferência aproximada de 314)
    const radius = 50;
    const circumference = Math.PI * radius; // Apenas a metade do círculo = ~157
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div
            style={{
                width: "160px",
                margin: "0 auto",
                textAlign: "center",
                fontFamily: "sans-serif",
            }}
        >
            <div style={{ position: "relative", width: "100%" }}>
                {/* Gráfico Nativo em SVG */}
                <svg
                    viewBox="0 0 120 65"
                    style={{ width: "100%", height: "auto" }}
                >
                    {/* Fundo Cinza */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={`${circumference} ${circumference}`}
                        transform="rotate(-180 60 60)"
                    />
                    {/* Progresso Azul */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        stroke="#222222"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-180 60 60)"
                    />
                </svg>

                {/* Textos Centralizados na Base do Arco */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#2d2d2d",
                            strokeLinecap: "round",
                        }}
                    >
                        {percentage}%
                    </span>
                    <span
                        style={{
                            fontSize: "12px",
                            color: "#dc2626",
                            fontWeight: "bold",
                            marginTop: "2px",
                        }}
                    >
                        {changeText}
                    </span>
                </div>
            </div>
        </div>
    );
}
