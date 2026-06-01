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

  const showTooltipAt = useCallback(
    (title: string, body: string | string[], x: number, y: number) => {
      setTooltip({ title, body, x, y });
    },
    [],
  );

  const hideTooltip = useCallback(() => setTooltip(null), []);

  return { tooltip, showTooltip, showTooltipAt, hideTooltip };
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
      className="not-prose pointer-events-none fixed z-50 rounded-lg bg-black/60 p-4 text-sm text-white"
      style={{ left, top, width }}
    >
      {info.title && (
        <div className="mb-2 text-center font-bold leading-snug">
          {info.title}
        </div>
      )}
      {info.body &&
        (Array.isArray(info.body) ? (
          <ul className="mb-0 ml-4 list-disc">
            {info.body.map((text) => (
              <li key={text} className="mb-0 leading-snug text-xs">
                {text}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-xs">{info.body}</span>
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
