# Remotion Accesible - Videos Inclusivos

## Referencias

- [Remotion Documentation](https://www.remotion.dev/)
- [Remotion Accessibility Statement](https://www.remotion.dev/docs/accessibility)
- [WCAG 1.2 - Time-based Media](https://www.w3.org/TR/WCAG22/#time-based-media)

---

## Introducción

Remotion permite crear videos programáticos con React. La accesibilidad en video incluye:

1. **Subtítulos/Captions** (WCAG 1.2.2)
2. **Audiodescripción** (WCAG 1.2.3, 1.2.5)
3. **Transcripciones** (WCAG 1.2.8)
4. **Control del usuario** (WCAG 1.4.2)
5. **Seizure prevention** (WCAG 2.3.1)

---

## Componente de Video Accesible

```tsx
import { useVideoConfig, useCurrentFrame, Video } from 'remotion';
import { useState, useRef } from 'react';

interface AccessibleVideoProps {
  src: string;
  captions?: string; // URL del archivo VTT
  transcript?: string; // Transcripción completa
  audioDescription?: string; // Descripción de audio
  title: string;
}

export const AccessibleVideo: React.FC<AccessibleVideoProps> = ({
  src,
  captions,
  transcript,
  audioDescription,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="accessible-video-container">
      {/* Título del video */}
      <h2>{title}</h2>
      
      {/* Video con tracks accesibles */}
      <video
        ref={videoRef}
        src={src}
        controls
        crossOrigin="anonymous"
        aria-label={title}
      >
        {/* Subtítulos/captions */}
        {captions && (
          <track
            kind="captions"
            src={captions}
            srcLang="es"
            label="Español"
            default={showCaptions}
          />
        )}
        
        {/* Audiodescripción */}
        {audioDescription && (
          <track
            kind="descriptions"
            src={audioDescription}
            srcLang="es"
            label="Descripción de audio"
          />
        )}
        
        {/* Transcripción como fallback */}
        <p>
          Tu navegador no soporta video HTML5. 
          {transcript && (
            <a href={transcript}>Descargar transcripción</a>
          )}
        </p>
      </video>
      
      {/* Controles accesibles */}
      <div className="video-controls" role="group" aria-label="Controles de video">
        <button
          onClick={() => setShowCaptions(!showCaptions)}
          aria-pressed={showCaptions}
          aria-label={showCaptions ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}
        >
          {showCaptions ? '📺 CC' : '📺'}
        </button>
        
        {transcript && (
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            aria-expanded={showTranscript}
            aria-controls="transcript-panel"
          >
            {showTranscript ? 'Ocultar transcripción' : 'Ver transcripción'}
          </button>
        )}
      </div>
      
      {/* Panel de transcripción */}
      {transcript && showTranscript && (
        <div 
          id="transcript-panel"
          role="region"
          aria-label="Transcripción del video"
          className="transcript-panel"
          tabIndex={0}
        >
          <h3>Transcripción</h3>
          <pre>{transcript}</pre>
        </div>
      )}
    </div>
  );
};
```

---

## Subtítulos/Captions VTT

### Formato WebVTT

```vtt
WEBVTT

1
00:00:00.000 --> 00:00:03.000
Bienvenidos a nuestro tutorial de accesibilidad

2
00:00:03.000 --> 00:00:07.000
<v Juan>En este video aprenderemos las mejores prácticas</v>

3
00:00:07.000 --> 00:00:10.000 line:90%
<music>Música de fondo</music>

4
00:00:10.000 --> 00:00:15.000
<v Juan>Primero, veamos los principios de WCAG... [silencio]</v>

5
00:00:15.000 --> 00:00:20.000
<v Juan>Perceptible, Operable, Comprensible y Robusto</v>
```

### Componente Caption en Remotion

```tsx
import { useVideoConfig, useCurrentFrame } from 'remotion';

interface CaptionData {
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

interface CaptionsProps {
  captions: CaptionData[];
}

export const Captions: React.FC<CaptionsProps> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const currentFrame = useCurrentFrame();
  const currentTime = currentFrame / fps;
  
  // Encontrar caption actual
  const currentCaption = captions.find(
    cap => currentTime >= cap.startTime && currentTime <= cap.endTime
  );
  
  if (!currentCaption) return null;
  
  return (
    <div 
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 1.4,
      }}
      role="region"
      aria-label="Subtítulos"
      aria-live="polite"
    >
      {currentCaption.speaker && (
        <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
          {currentCaption.speaker}:
        </span>
      )}
      {currentCaption.text}
    </div>
  );
};

// Uso en composición
export const VideoWithCaptions: React.FC = () => {
  const captions: CaptionData[] = [
    { startTime: 0, endTime: 3, text: 'Bienvenidos al tutorial', speaker: 'Narrador' },
    { startTime: 3, endTime: 7, text: 'Vamos a aprender accesibilidad', speaker: 'Narrador' },
  ];
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Video src="https://example.com/video.mp4" />
      <Captions captions={captions} />
    </div>
  );
};
```

---

## Prevención de Convulsiones (WCAG 2.3.1)

```tsx
import { useVideoConfig, useCurrentFrame } from 'remotion';

// Verificar flashes
const checkFlashing = (frames: number[][]): boolean => {
  // General Flash and Red Flash Thresholds
  const FLASH_THRESHOLD = 3; // Hz
  const RED_FLASH_THRESHOLD = 3; // Hz
  
  // Implementación simplificada
  // En producción, usar una librería como 'photosensitive' o analizar frames
  return false;
};

// Componente con advertencia de fotosensibilidad
export const PhotosensitiveWarning: React.FC = () => {
  return (
    <div 
      role="alert"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffeb3b',
        color: '#000',
        padding: '10px',
        textAlign: 'center',
        fontWeight: 'bold',
        zIndex: 1000,
      }}
    >
      ⚠️ Advertencia: Este video contiene luces parpadeantes que pueden 
      afectar a personas con epilepsia fotosensible.
    </div>
  );
};

// Opción para desactivar animaciones
export const ReducedMotionVideo: React.FC<{ src: string }> = ({ src }) => {
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return (
      <div role="region" aria-label="Versión estática del video">
        <img 
          src="/video-poster.jpg" 
          alt="Versión estática del video. Consulta la transcripción para el contenido completo."
        />
        <p>Se ha detectado preferencia de movimiento reducido.</p>
      </div>
    );
  }
  
  return <Video src={src} />;
};
```

---

## Controles Accesibles

```tsx
import { useState } from 'react';
import { useVideoConfig, useCurrentFrame } from 'remotion';

interface AccessibleControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const AccessibleControls: React.FC<AccessibleControlsProps> = ({
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  volume,
  onVolumeChange,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div 
      role="toolbar"
      aria-label="Controles de reproducción"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      {/* Play/Pause */}
      <button
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        aria-pressed={isPlaying}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      
      {/* Tiempo */}
      <span 
        aria-label={`Tiempo actual: ${formatTime(currentTime)} de ${formatTime(duration)}`}
        style={{ color: 'white', fontFamily: 'monospace' }}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      
      {/* Volumen */}
      <div role="group" aria-label="Control de volumen">
        <button
          onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
          aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          aria-label="Volumen"
          style={{ width: '100px' }}
        />
      </div>
    </div>
  );
};
```

---

## Lista de Verificación

```yaml
CHECKLIST_REMOTION_A11Y:
  Video:
    - [ ] Subtítulos/captions disponibles (WCAG 1.2.2)
    - [ ] Audiodescripción para contenido visual (WCAG 1.2.3, 1.2.5)
    - [ ] Transcripción completa disponible (WCAG 1.2.8)
    - [ ] Controles de reproducción accesibles
    - [ ] Control de volumen independiente
  
  Fotosensibilidad:
    - [ ] No más de 3 flashes por segundo (WCAG 2.3.1)
    - [ ] Área de flash reducida
    - [ ] Opción para desactivar animaciones
    - [ ] Advertencia si hay contenido parpadeante
  
  Preferencias:
    - [ ] Respeta prefers-reduced-motion
    - [ ] Opción de transcripción estática
  
  Controles:
    - [ ] Botones con aria-label descriptivo
    - [ ] Estados aria-pressed donde aplique
    - [ ] Navegación por teclado funcional
```
