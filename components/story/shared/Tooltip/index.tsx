import {
  type FC,
  type MouseEvent,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface TooltipInfo {
  title: string;
  body: string | string[];
  x: number;
  y: number;
}

export const useTooltip = () => {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const showTooltip = useCallback(
    (title: string, body: string | string[]) =>
      (e: MouseEvent | TouchEvent) => {
        const isTouch = "touches" in e;
        const clientX = isTouch
          ? (e as TouchEvent).touches[0].clientX
          : (e as MouseEvent).clientX;
        const clientY = isTouch
          ? (e as TouchEvent).touches[0].clientY
          : (e as MouseEvent).clientY;
        setTooltip({ title, body, x: clientX, y: clientY });
      },
    [],
  );

  const hideTooltip = useCallback(() => setTooltip(null), []);

  return { tooltip, showTooltip, hideTooltip };
};

interface TooltipProps {
  info: TooltipInfo | null;
}

const Tooltip: FC<TooltipProps> = ({ info }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!tooltipRef.current) return;
    const { offsetWidth, offsetHeight } = tooltipRef.current;
    if (
      Math.abs(offsetWidth - size.width) +
        Math.abs(offsetHeight - size.height) >
      2
    ) {
      setSize({ width: offsetWidth, height: offsetHeight });
    }
  });

  if (!info) return null;

  const left = Math.max(info.x - size.width / 2, 0);
  const top = info.y - size.height - 20;
  const width = info.x > size.width / 2 ? undefined : `${2 * info.x}px`;

  return (
    <div
      ref={tooltipRef}
      className="pointer-events-none fixed z-50 rounded bg-black/60 p-3 text-white"
      style={{ left, top, width }}
    >
      {info.title && (
        <h4 className="mb-2 text-center font-bold">{info.title}</h4>
      )}
      {info.body &&
        (Array.isArray(info.body) ? (
          <ul className="mb-0 ml-3 list-disc">
            {info.body.map((text) => (
              <li key={text} className="leading-tight">
                <small>{text}</small>
              </li>
            ))}
          </ul>
        ) : (
          <small>{info.body}</small>
        ))}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          marginLeft: "-7px",
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "7px solid rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
};

export default Tooltip;
