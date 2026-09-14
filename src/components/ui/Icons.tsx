/**
 * Line marks redrawn from the Conscious Choice label artwork so the page and
 * the bottle speak the same visual language. Same circle, same stroke weight.
 */

type P = { className?: string };

const wrap = (children: React.ReactNode, className?: string) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="22" strokeWidth={1.3} opacity={0.55} />
    {children}
  </svg>
);

export const IconLeaf = ({ className }: P) =>
  wrap(
    <>
      <path d="M33 15c0 9.2-5.4 15.5-14.4 16.6-1.6.2-2.6.1-3.6-.2C14 27 16.1 20.9 21 18.1c3.4-2 7.6-2.8 12-3.1Z" />
      <path d="M15 33.5C18.4 27 23.5 22.4 30 19.6" />
    </>,
    className,
  );

export const IconPress = ({ className }: P) =>
  wrap(
    <>
      <path d="M15 15.5h18" />
      <path d="M17.5 15.5v4.2c0 1 .4 2 1.2 2.7l3.2 2.9c.7.6 1.1 1.5 1.1 2.4v5.8" />
      <path d="M30.5 15.5v4.2c0 1-.4 2-1.2 2.7l-3.2 2.9c-.7.6-1.1 1.5-1.1 2.4v5.8" />
      <path d="M18 33.5h12" />
    </>,
    className,
  );

export const IconNoSugar = ({ className }: P) =>
  wrap(
    <>
      <path d="M24 14.5c3.9 4.4 5.9 7.9 5.9 11.1A5.9 5.9 0 0 1 24 31.5a5.9 5.9 0 0 1-5.9-5.9c0-3.2 2-6.7 5.9-11.1Z" />
      <path d="M16 32.5 32 16" />
    </>,
    className,
  );

export const IconFlask = ({ className }: P) =>
  wrap(
    <>
      <path d="M21 14.5v7.2L15.8 31a2.6 2.6 0 0 0 2.2 4h12a2.6 2.6 0 0 0 2.2-4L27 21.7v-7.2" />
      <path d="M19.4 14.5h9.2" />
      <path d="M18.4 28.2h11.2" />
    </>,
    className,
  );

export const IconGlobe = ({ className }: P) =>
  wrap(
    <>
      <circle cx="24" cy="24" r="10" />
      <path d="M14 24h20" />
      <path d="M24 14c3 3.4 4.6 6.9 4.6 10S27 30.6 24 34c-3-3.4-4.6-6.9-4.6-10S21 17.4 24 14Z" />
    </>,
    className,
  );

export const IconHeart = ({ className }: P) =>
  wrap(
    <path d="M24 33.5c-5.6-3.7-9.6-7.1-9.6-11.2a4.9 4.9 0 0 1 9.6-1.6 4.9 4.9 0 0 1 9.6 1.6c0 4.1-4 7.5-9.6 11.2Z" />,
    className,
  );

export const IconRecycle = ({ className }: P) =>
  wrap(
    <>
      <path d="M24 15.5 27.6 22h-7.2L24 15.5Z" />
      <path d="M31.6 24.5 34 28.8a2 2 0 0 1-1.7 3h-5" />
      <path d="M16.4 24.5 14 28.8a2 2 0 0 0 1.7 3h5" />
      <path d="M22 29.3 19.8 31.8 22 34.2" />
      <path d="M26 29.3l2.2 2.5-2.2 2.4" />
    </>,
    className,
  );

export const Wordmark = ({
  className,
  ...rest
}: P & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    <path
      d="M20 4.5c6.6 0 11.8 4.2 11.8 9.6 0 3.4-2 6-4.6 8.6-2.4 2.4-4.6 4.6-5.3 8.2a.9.9 0 0 1-1.8 0c-.7-3.6-2.9-5.8-5.3-8.2-2.6-2.6-4.6-5.2-4.6-8.6C10.2 8.7 15.4 4.5 20 4.5Z"
      stroke="currentColor"
      strokeWidth={1.7}
    />
    <path
      d="M20 30V18.5m0 0c0-2.6 1.6-4.6 4-5.4m-4 5.4c0-2.6-1.6-4.6-4-5.4"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </svg>
);
