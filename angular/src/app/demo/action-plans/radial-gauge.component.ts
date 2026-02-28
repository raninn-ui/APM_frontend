import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radial-gauge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gauge-container">
      <svg viewBox="0 0 200 200" class="gauge-svg" preserveAspectRatio="xMidYMid meet">
        <!-- Background circle (light gray) -->
        <circle cx="100" cy="100" r="60" fill="none" stroke="#e5e7eb" stroke-width="14"/>

        <!-- Filled circle (green) - animated based on percentage -->
        <circle cx="100" cy="100" r="60" fill="none" stroke="#22c55e" stroke-width="14"
                [style.stroke-dasharray]="376.8"
                [style.stroke-dashoffset]="376.8 - (376.8 * percentage / 100)"
                transform="rotate(-90 100 100)" stroke-linecap="round"
                class="gauge-fill"/>

        <!-- Center text -->
        <text x="100" y="100" text-anchor="middle" dominant-baseline="middle"
              class="gauge-text-value">{{ percentage }}</text>
        <text x="100" y="118" text-anchor="middle" dominant-baseline="middle"
              class="gauge-text-unit">%</text>
      </svg>
    </div>
  `,
  styles: [`
    .gauge-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 160px;
    }

    .gauge-svg {
      width: 100%;
      max-width: 160px;
      height: auto;
    }

    .gauge-fill {
      transition: stroke-dashoffset 0.5s ease;
    }

    .gauge-text-value {
      font-size: 32px;
      font-weight: bold;
      fill: #333;
    }

    .gauge-text-unit {
      font-size: 14px;
      fill: #666;
    }
  `]
})
export class RadialGaugeComponent {
  @Input() percentage: number = 0;
}

