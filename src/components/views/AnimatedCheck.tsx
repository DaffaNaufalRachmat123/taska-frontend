import React from 'react';
import '../../assets/css/checklistAnim.css';

interface AnimatedIconProps {
  duration?: number; // Duration in seconds, default is 1s
  size?: 'small' | 'medium' | 'large'; // Predefined sizes
  width?: string | number; // Custom width
  height?: string | number; // Custom height
  color?: string; // Custom stroke color
  type?: 'check' | 'close' | 'warning' | 'notFound'; // Type of animation
  infinite?: boolean; // Whether the animation should loop infinitely
  loopDelay?: number; // Delay in seconds between each loop of the animation
}

const sizeMapping = {
  small: { width: '2em', height: '2em' },
  medium: { width: '4em', height: '4em' },
  large: { width: '6em', height: '6em' },
};

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  duration = 1, // Default duration 1s
  size = 'medium',
  width,
  height,
  color = '#7ac142', // Default color
  type = 'check', // Default type is check
  infinite = false, // Default is not infinite
  loopDelay = 1, // Default delay between loops is 1s
}) => {
  const { width: predefinedWidth, height: predefinedHeight } = sizeMapping[size];
  const finalWidth = width ?? predefinedWidth;
  const finalHeight = height ?? predefinedHeight;

  const renderPath = () => {
    switch (type) {
      case 'check':
        return 'M4.1 12.7L9 17.6 20.3 6.3' // Circle + Checkmark path
      case 'close':
        return 'M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2z M8 8L16 16M8 16L16 8'; // Circle + Close (X) path
      case 'warning':
        return 'M12 2L2 22h20L12 2z M12 10v5 M12 18v1'; // Triangle + Exclamation
      case 'notFound':
        return 'M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2z M10 10l4 4M10 14l4-4'; // Circle + "X"
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-center">
      <svg
        className={`animated-icon animated-${type}`}
        viewBox="0 0 24 24"
        style={{
          width: finalWidth,
          height: finalHeight,
        }}
      >
        <path
          d={renderPath()}
          fill="none"
          style={{
            animationDuration: `${duration + loopDelay}s`, // Total cycle time: duration + loopDelay
            stroke: color,
            animationIterationCount: infinite ? 'infinite' : '1',
            animationTimingFunction: 'linear',
          }}
        />
      </svg>
    </div>
  );
};

export default AnimatedIcon;
