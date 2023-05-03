import { SVGProps } from "react";

interface CircleProps {
  stroke: string;
  fill: string;
  strokeWidth: string;
  strokeDasharray: string;
  r: string;
  cx: string;
  cy: string;
  radius: number;
}
const SvgComponent = ({
  svgProps,
  circleProps,
}: {
  svgProps: SVGProps<SVGSVGElement>;
  circleProps: CircleProps;
}) => (
  <svg {...svgProps}>
    <circle
      fill={circleProps.fill}
      stroke={circleProps.stroke}
      strokeWidth={circleProps.strokeWidth}
            strokeDasharray={circleProps.strokeDasharray}
            
    />
  </svg>
);
export default SvgComponent;
