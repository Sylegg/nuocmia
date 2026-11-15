import { useId } from "react";

const endRim = "M240 2H76C35 2 2 23.5 2 50S35 98 76 98H240";
const endShape = `${endRim}Z`;
const centerRim = `M0 98H120C160 98 189 106 224 103
  C255 100 278 90 301 93C323 95 325 104 347 106
  C377 109 409 97 441 99C469 101 488 110 500 121
  C512 110 531 101 559 99C591 97 623 109 653 106
  C675 104 677 95 699 93C722 90 745 100 776 103
  C811 106 840 98 880 98H1000`;
const centerShape = `${centerRim}V2H0Z`;

function HeaderEnd({ id, right }: { id: string; right?: boolean }) {
  return (
    <svg
      className={`arcana-header-end${right ? " arcana-header-end-right" : ""}`}
      viewBox="0 0 240 124"
      preserveAspectRatio="none"
    >
      <defs>
        <clipPath id={`${id}-end-${right ? "right" : "left"}`}>
          <path d={endShape} />
        </clipPath>
      </defs>
      <path d={endShape} fill={`url(#${id}-basin)`} />
      <g clipPath={`url(#${id}-end-${right ? "right" : "left"})`}>
        <path fill="#21464b" opacity=".65" d="M0 17C19 8 44 15 56 25C73 20 96 40 106 45C128 48 143 57 165 70L240 101H0Z" />
        <path fill="#31595a" opacity=".52" d="M0 28C34 25 47 33 67 38C83 37 100 48 121 52C100 56 79 64 102 73C125 82 167 75 205 100H0Z" />
        <path fill="#0b242b" d="M0 63C30 54 58 60 80 56C101 52 126 41 150 50C181 69 196 72 240 93V101H0Z" />
        <path fill={`url(#${id}-mist)`} d="M0 35C25 35 34 44 56 45C84 47 112 54 102 63C94 72 111 74 138 76C161 78 174 84 183 89C195 95 215 96 240 98C204 101 180 99 167 93C150 85 142 85 120 84C90 82 65 77 69 68C75 59 49 55 26 54L0 51Z" />
        <path fill="#fff0be" opacity=".65" d="M7 46C48 47 56 52 75 54C91 57 104 59 100 64C93 71 111 76 134 77C157 78 175 85 182 90C191 95 210 97 240 98C205 99 188 98 174 92C161 84 146 81 129 81C101 81 79 75 83 66C92 56 39 53 7 46Z" />
        <path fill="#367575" opacity=".24" d="M0 68C35 68 52 83 79 82C102 82 117 88 130 94L174 98H0Z" />
      </g>
      <path
        d={endRim}
        fill="none"
        stroke={`url(#${id}-rim)`}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function CenterMist({ id }: { id: string }) {
  return (
    <g transform="translate(0 27.44) scale(1 .72)">
      <path fill="#214750" opacity=".68" d="M87 98C163 99 201 90 236 84C271 77 302 69 325 75C345 80 359 94 377 92C391 86 403 89 426 100C396 99 367 120 340 111C309 102 307 87 280 94C247 105 202 110 172 104Z" />
      <path fill={`url(#${id}-crest)`} d="M87 98C148 101 201 91 240 83C278 75 304 71 331 80C351 86 358 93 354 96C351 99 359 103 374 103C393 103 411 99 430 99C400 103 364 118 340 109C323 103 319 95 303 91C279 85 252 94 229 98C177 107 136 101 87 98Z" />
      <path fill="#fff0c2" opacity=".78" d="M184 94C225 89 263 73 305 77C334 79 350 88 342 93C338 95 348 101 367 103C350 104 336 102 330 98C324 93 323 88 310 85C279 79 242 92 213 94Z" />
    </g>
  );
}

export function ArcanaHeaderArt() {
  const id = `header-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div className="arcana-header-art" aria-hidden="true">
      <HeaderEnd id={id} />
      <svg className="arcana-header-crest" viewBox="0 0 1000 124" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${id}-basin`} x1="0" y1="0" x2="0" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0b1b20" />
            <stop offset=".64" stopColor="#10282c" />
            <stop offset="1" stopColor="#1a3a3c" />
          </linearGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ab8752" />
            <stop offset=".24" stopColor="#f6d58b" />
            <stop offset=".62" stopColor="#a6773e" />
            <stop offset=".79" stopColor="#edc77b" />
            <stop offset=".92" stopColor="#ffe5a2" />
            <stop offset="1" stopColor="#bb8c48" />
          </linearGradient>
          <linearGradient id={`${id}-mist`}>
            <stop stopColor="#57928b" stopOpacity=".25" />
            <stop offset=".4" stopColor="#e7e7b5" />
            <stop offset=".7" stopColor="#daba71" />
            <stop offset="1" stopColor="#e8c481" stopOpacity=".35" />
          </linearGradient>
          <linearGradient id={`${id}-crest`} x2="0" y2="1">
            <stop stopColor="#d7dbc0" />
            <stop offset=".5" stopColor="#85ada0" />
            <stop offset="1" stopColor="#527b77" />
          </linearGradient>
          <radialGradient id={`${id}-halo`}>
            <stop stopColor="#e6bd73" stopOpacity=".37" />
            <stop offset="1" stopColor="#e6bd73" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-glint`} x1="0" x2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff0ac" stopOpacity="0" />
            <stop offset=".48" stopColor="#fff3cb" />
            <stop offset="1" stopColor="#fff0ac" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${id}-center`}><path d={centerShape} /></clipPath>
        </defs>
        <path d={centerShape} fill={`url(#${id}-basin)`} />
        <g clipPath={`url(#${id}-center)`}>
          <ellipse cx="500" cy="118" rx="120" ry="40" fill={`url(#${id}-halo)`} />
          <CenterMist id={id} />
          <g transform="translate(1000) scale(-1 1)"><CenterMist id={id} /></g>
        </g>
        <path d={centerRim} fill="none" stroke="#d39d4d" strokeOpacity=".16" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <path d={`${centerRim} M0 2H1000`} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <g fill="none" stroke={`url(#${id}-glint)`} strokeWidth="1.6">
          <path d="M0 98H120" vectorEffect="non-scaling-stroke" />
          <path d="M0 98H120" vectorEffect="non-scaling-stroke" transform="translate(1000) scale(-1 1)" />
        </g>
      </svg>
      <HeaderEnd id={id} right />
      <svg className="arcana-header-stars" viewBox="0 0 116 64">
        <defs>
          <linearGradient id={`${id}-star`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff5ca" />
            <stop offset=".5" stopColor="#f6d489" />
            <stop offset="1" stopColor="#b77c3d" />
          </linearGradient>
        </defs>
        <path fill={`url(#${id}-star)`} d="M58 2C62 20 69 28 86 32C69 36 62 44 58 62C54 44 47 36 30 32C47 28 54 20 58 2ZM13 22C14 28 17 31 23 32C17 34 14 37 13 43C11 37 8 34 2 32C8 31 11 28 13 22ZM103 22C105 28 108 31 114 32C108 34 105 37 103 43C102 37 99 34 93 32C99 31 102 28 103 22Z" />
        <path fill="#fff7d7" opacity=".27" d="M58 2V32H30C47 28 54 20 58 2ZM58 32H86C69 36 62 44 58 62Z" />
      </svg>
    </div>
  );
}
