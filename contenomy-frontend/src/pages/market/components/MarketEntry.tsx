import React, { useEffect, useState } from "react";
import IMarketShare from "@model/MarketShare"; 
import { Box, Button, ListItem, List } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MarketEntry.css";
import { environment } from "../../../environment/environment.development"; // Import del file di configurazione dell'ambiente

// Componente MarketEntry che rappresenta un singolo creator nella lista
export function MarketEntry({
    marketShare,
    onExcangeClick,
    onDetailClick,
}: {
    marketShare: IMarketShare;
    onExcangeClick: () => void;
    onDetailClick: (id: number) => void;
}) {
    const { t } = useTranslation(); // Hook per la traduzione dei testi

    // Funzione per gestire il clic sull'elemento per aprire i dettagli del creator
    function openDetail(event: React.MouseEvent) {
        event.preventDefault(); // Previene il comportamento predefinito del link
        onDetailClick(marketShare.id); // Chiama la funzione onDetailClick con l'ID del creator
    }

    return (
        // Elemento della lista per un creator, cliccabile
        <ListItem onClick={openDetail}>
            {/* Mostra l'immagine del creator */}
            <Box
                className="h-auto border-solid border-gray-500 p-2"
                component="img"
                sx={{
                    width: 80,
                    height: 80,
                }}
                src={marketShare.thumbnail ?? "/user.png"} // Usa il thumbnail del creator o un'immagine di default
            />
            {/* Mostra il nome del creator */}
            <p className="w-1/6 ml-3">{marketShare.name}</p>
            {/* Mostra il prezzo del creator */}
            <p className="w-1/6 ml-3">
                {t("number:currency", { value: marketShare.price })}
            </p>
            {/* Mostra la variazione del prezzo del creator */}
            <p className="w-1/6 ml-3">
                {t("number:percent", { value: marketShare.trend })}
            </p>
            {/* Mostra la capitalizzazione di mercato del creator */}
            <p className="w-1/6 ml-3">
                {t("number:currency", { value: marketShare.marketCap })}
            </p>
            {/* Pulsante "Scambia" */}
            <div className="ml-10">
                <Button
                    variant="contained"
                    onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation(); // Impedisce la propagazione dell'evento per evitare di attivare openDetail
                        onExcangeClick(); // Chiama la funzione onExcangeClick
                    }}
                >
                    Scambia
                </Button>
            </div>
        </ListItem>
    );
}

// Componente principale della pagina Mercato
export default function MarketPage() {
    const navigate = useNavigate(); // Hook per la navigazione programmatica
    const { t } = useTranslation(); // Hook per la traduzione dei testi

    // Stato per memorizzare i dati delle market shares
    const [marketShares, setMarketShares] = useState<IMarketShare[]>([]);
    const [loading, setLoading] = useState(true); // Stato di caricamento

    // Effettua il fetch delle market shares all'avvio del componente
    useEffect(() => {
        const fetchMarketShares = async () => {
            try {
                const response = await fetch(`${environment.serverUrl}/market/GetMarketShares`); // Richiesta GET all'endpoint del backend
                const data = await response.json();
                setMarketShares(data); // Imposta i dati delle market shares nello stato
                setLoading(false); // Imposta lo stato di caricamento su false
            } catch (error) {
                console.error("Errore durante il fetch delle MarketShares:", error); // Log degli errori
                setLoading(false);
            }
        };

        fetchMarketShares();
    }, []);

    // Mostra un messaggio di caricamento se i dati non sono ancora stati caricati
    if (loading) {
        return <p>{t("loading")}</p>;
    }

    // Mostra un messaggio se non ci sono market shares disponibili
    if (!marketShares || marketShares.length === 0) {
        return <p>No market shares available.</p>;
    }

    // Funzione per gestire il clic sull'elemento dello slider o della lista
    function handleClick(creatorId: number) {
        navigate(`/market/${creatorId}`); // Naviga alla pagina dei dettagli del creator
    }

    // Impostazioni dello slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <SampleNextArrow />, // Componenti per le frecce dello slider
        prevArrow: <SamplePrevArrow />,
    };

    return (
        <Box className="market-page">
            <h2>Highlights</h2>
            {/* Slider per mostrare i creators con la variazione di prezzo più alta */}
            <Slider {...settings}>
                {marketShares
                    .sort((a, b) => b.trend - a.trend) // Ordina i market shares per variazione di prezzo (trend) discendente
                    .slice(0, 10) // Prende i primi 10 market shares
                    .map((marketShare) => (
                        <div key={marketShare.id} onClick={() => handleClick(marketShare.id)}>
                            <Box className="market-card">
                                <Box
                                    component="img"
                                    className="market-card-img"
                                    src={marketShare.thumbnail ?? "/user.png"}
                                    alt={marketShare.name}
                                />
                                <Box className="market-card-info">
                                    <p className="market-card-name">{marketShare.name}</p>
                                    <p className="market-card-price">{marketShare.price}€</p>
                                    <p className="market-card-trend">
                                        {marketShare.trend > 0 ? `+${marketShare.trend}%` : `${marketShare.trend}%`}
                                    </p>
                                </Box>
                            </Box>
                        </div>
                    ))}
            </Slider>
            <h2>Mercato</h2>
            <List>
                {/* Mostra la lista completa dei market shares */}
                {marketShares.map((marketShare) => (
                    <MarketEntry
                        key={marketShare.id}
                        marketShare={marketShare}
                        onExcangeClick={() => console.log("Exchange clicked")}
                        onDetailClick={handleClick}
                    />
                ))}
            </List>
        </Box>
    );
}

// Componenti per le frecce dello slider
function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "#024089", borderRadius: "50%" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "#024089", borderRadius: "50%" }}
            onClick={onClick}
        />
    );
}
