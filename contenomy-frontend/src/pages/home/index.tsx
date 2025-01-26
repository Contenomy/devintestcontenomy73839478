import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { environment } from '@environment/environment.development';
import { ContentCreatorInfo } from '@model/ContentCreatorInfo';
import { environment } from '@environment/environment.development';
import './home.css';

const CreatorCard = ({ creator }: { creator: ContentCreatorInfo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/creator/${creator.userId}`);
  };

  return (
    <div className="partner-item" onClick={handleClick}>
      <img src="/user.png" alt={creator.nickname} className="partner-image" />
      <p>{creator.nickname || creator.username}</p>
    </div>
  );
};

const FAQItem = ({ question, answer, number }: { question: string; answer: string; number: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button 
        className={`faq-question ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        data-number={number}
      >
        {question}
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>{answer}</div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [creators, setCreators] = useState<ContentCreatorInfo[]>([]);
  const [creatorsLoaded, setCreatorsLoaded] = useState(false);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch(`${environment.serverUrl}/api/ContentCreator`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Dati ricevuti:', data);
          setCreators(data);
          setCreatorsLoaded(true);
        } else {
          console.error('Errore nella risposta API:', response.status, response.statusText);
          setCreatorsLoaded(false);
        }
      } catch (error) {
        console.error('Errore durante il caricamento dei content creator:', error);
        setCreatorsLoaded(false);
      }
    };

    fetchCreators();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const displayedCreators = creators.slice(0, 8);

  const faqData = [
    { 
      question: "Cos'è Contenomy?", 
      answer: "Contenomy è una piattaforma innovativa che consente ai creatori di contenuti di monetizzare il proprio lavoro attraverso la vendita di SupportShare, unità digitali che rappresentano una frazione del valore generato dal creatore stesso. Gli utenti possono investire nei creatori, supportandoli e partecipando ai loro successi."
    },
    { 
      question: "Cosa sono le SupportShare?", 
      answer: "Le SupportShare sono unità digitali che rappresentano una quota di partecipazione nel successo di un creatore di contenuti su Contenomy. Acquistando SupportShare, gli utenti possono sostenere i loro creatori preferiti e partecipare agli utili generati dalle loro attività e contenuti."
    },
    { 
      question: "Come guadagnano i creatori di contenuti?", 
      answer: "I creatori di contenuti guadagnano attraverso la vendita delle loro SupportShare e sulle transazioni effettuate dagli utenti che investono nelle loro SupportShare."
    },
    { 
      question: "Come guadagnano i follower e gli investitori?", 
      answer: "I follower e gli investitori guadagnano attraverso i premi periodici distribuiti in base al valore delle SupportShare che possiedono. Inoltre, possono trarre profitto dalla vendita delle SupportShare sul mercato, soprattutto se il valore del creatore cresce nel tempo."
    },
    { 
      question: "Cosa si intende per premi periodici?", 
      answer: "I premi periodici sono una forma di remunerazione distribuita regolarmente agli investitori che possiedono SupportShare di un content creator che eroga premi."
    },
    { 
      question: "Come acquistare SupportShare su Contenomy?", 
      answer: "Per acquistare SupportShare su Contenomy, basta registrarsi sulla piattaforma, accedere alla sezione 'Mercato', selezionare il creatore di contenuti e scegliere la quantità di SupportShare da acquistare. Il processo di acquisto è semplice e sicuro."
    }
  ];

  return (
    <div className="landing-page">
      <section className="hero-section text-center">
        <h1>
          <span className="highlighted-text">Supporta</span> i tuoi creatori preferiti 
          <br />
          e <span className="highlighted-text">guadagna</span> dal loro successo!
        </h1>
        <p>Investi nelle persone in cui credi, ci guadagni anche tu</p>
        <div className="hero-buttons">
          <button 
            className="btn btn-secondary" 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Scopri come
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/market')}
          >
            Iniziamo!
          </button>
        </div>
      </section>

      <section className="partners-section">
        <h2>I nostri partner</h2>
        {creatorsLoaded ? (
          <div className="partners-list">
            {displayedCreators.map(creator => (
              <CreatorCard key={creator.userId} creator={creator} />
            ))}
          </div>
        ) : (
          <p>Caricamento dei partner in corso...</p>
        )}
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2>Come funziona</h2>
        <div className="how-it-works-container">
          <div className="how-it-works-steps">
            <div className="step">
              <div className="step-icon">1</div>
              <p><span className="highlight-word">Cerca</span> tra i creators iscritti alla nostra piattaforma</p>
            </div>
            <div className="step">
              <div className="step-icon">2</div>
              <p><span className="highlight-word">Sostieni</span> i tuoi creators preferiti acquistando le loro SupportShare</p>
            </div>
            <div className="step">
              <div className="step-icon">3</div>
              <p><span className="highlight-word">Guadagna</span> dai premi rilasciati dal creator o dallo scambio di SupportShare con altri utenti</p>
            </div>
          </div>
          <div className="how-it-works-image">
            <img src="/images/landingpage/comefunziona.png" alt="Come funziona Contenomy" />
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2>FAQ</h2>
        {faqData.map((faq, index) => (
          <FAQItem 
            key={index} 
            question={faq.question} 
            answer={faq.answer} 
            number={index + 1}
          />
        ))}
      </section>

      <section className="final-section">
        <div className="final-section-images">
          <img src="/images/landingpage/sezionefinale1.png" alt="Sezione Finale 1" />
        </div>
        <div className="final-section-text">
          <h2>Inizia subito a <span className="highlighted-text">crescere</span> assieme ai creators</h2>
          <p>Guadagna passivamente dai premi periodici rilasciati dai creators e dallo scambio di ContentShare</p>
          <button className="btn btn-primary" onClick={() => navigate('/market')}>Inizia a esplorare</button>
        </div>
        <div className="final-section-images">
          <img src="/images/landingpage/sezionefinale2.png" alt="Sezione Finale 2" />
        </div>
      </section>
    </div>
  );
}
