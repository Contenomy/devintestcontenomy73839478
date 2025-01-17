import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Avatar } from '@mui/material';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './MarketHighlights.css';

interface MarketHighlightsProps {
  marketShares: any[];
}

export default function MarketHighlights({ marketShares }: MarketHighlightsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "cubic-bezier(0.45, 0, 0.55, 1)",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handleCardClick = (id: number) => {
    navigate(`/market/${id}`);
  };

  return (
    <Box className="market-highlights">
      <Slider {...settings}>
        {marketShares.map((share) => (
          <Box key={share.userId} className="highlight-slide-container">
            <Card 
              className="highlight-card"
              onClick={() => handleCardClick(share.id)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar
                    src={share.thumbnail ?? "/user.png"}
                    alt={share.name}
                    className="highlight-avatar"
                  />
                  <Typography variant="subtitle1" className="highlight-name" ml={1}>
                    {share.nickname || share.username}
                  </Typography>
                </Box>
                <Typography variant="body2" className="highlight-price">
                  {t("number:currency", { value: share.currentValue })}
                </Typography>
                <Typography 
                  variant="body2" 
                  className={`highlight-trend ${share.trend > 0 ? 'positive' : 'negative'}`}
                >
                  {t("number:percent", { value: share.trend ?? 0 })}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}