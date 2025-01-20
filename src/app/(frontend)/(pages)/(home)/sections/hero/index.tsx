"use client";

import styles from "./Hero.module.css";

export default function Hero() {
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.heroTitle}>Crafting Reactive Web Solutions</h1>
        <p className={styles.description}>
          Building modern and reliable web applications
        </p>
        <button className={styles.button} onClick={handleClick}>
          Get Started
        </button>
      </div>
      <div className={styles.referencesPanel}>
        <div className={styles.referencesTitle}>Cooperated with:</div>
        <div className={styles.references}>
          <svg
            className={styles.referenceIcon}
            width="508.25"
            height="148.34"
            clipRule="evenodd"
            fillRule="evenodd"
            imageRendering="optimizeQuality"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            version="1.0"
            viewBox="0 0 240 73.846"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              transform="translate(-.06 .147)"
              d="M163.113 27.905c0 7.65-4.767 17.701-8.212 24.342-5.412 10.45-12.732 16.712-24.636 17.45-10.521.653-34.3 2.48-30.135-15.25 1.807-7.676 5.821-14.438 8.286-21.85 8.281-16.523 29.122-19.673 45.679-15.544 5.604 2.04 8.587 4.768 9.018 10.851zm-27.789.733c-8.51 0-9.547 11.88-11.144 18.257-.402 2.41-3.1 10.485 1.246 10.485 10.232 2.057 11.184-9.165 12.905-16.644.632-2.752 1.887-7.368 1.32-10.192 0-2.1-2.93-1.766-4.327-1.906zm-58.583.513c-1.05 20.12-15.181 18.554-31.968 18.477-6.38-.026-12.903-.44-19.21-.44-2.327 2.36 4.41 9.52 6.306 10.705 6.47 4.03 14.588 2.3 19.797-2.933 2.798 0 32.832-3.926 22.436 6.452-5.032 4.477-12.151 7.122-18.624 8.652-20.595 4.87-65.083-6.969-50.078-36C15.657 17.181 37.874 7.95 56.21 3.195c1.708-.342 3.395-.605 5.133-.734C74.39 1.488 76.74 19.494 76.74 29.152zm-19.136-1.613c0-1.82.074-3.744-.514-5.499-2.014-8.113-23.142 9.212-25.662 11.731-.316.637-.077.44.366.66 7.013 0 14.041-.073 21.043-.073 4.612-.761 4.766-2.165 4.766-6.819zm40.693 10.338c-1.59 3.202-1.235 7.402-4.473 9.825-4.429 3.313-15.583 3.322-13.125-4.692 2.328-7.62 6.729-10.86 14.738-8.872 1.954.654 2.415 1.948 2.86 3.74zm139.456-9.898c0 2.051-.43 4.166-.88 6.159-2.647 11.699-6.915 22.829-10.705 34.094-3.478 3.478-10.708 1.584-14.445-.66-1.869-1.869 2.778-11.406 3.52-13.71 1.139-3.54 7.36-16.594 2.126-19.21-1.683 0-3.022.22-4.692.66-15.662 5.482-26.779 21.425-38.054 32.7-4.887 2.461-8.396 1.831-13.197-.586-.477-.477-.246-1.233-.147-1.833 3.633-15.175 9.38-30.22 15.617-44.506.981-2.917 11.065-1.836 13.565-.587 0 3.23-.34 8.652 4.325 8.652 10.466-1.153 36.11-23.87 42.6-4.399.184 1.1.367 2.096.367 3.226z"
              fill="currentColor"
            />
          </svg>
          <svg
            className={styles.referenceIcon}
            version="1.0"
            viewBox="0 0 181 87"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="currentColor">
              <path d="M17.3 45.8c1.9-13.2 3.5-20.9 4.5-22 1-1.2 3-1.8 6.2-1.8 4.4 0 4.8.2 6.6 3.7 1 2.1 3 5.5 4.2 7.5l2.4 3.7 5.1-6.2c2.8-3.4 5.8-6.7 6.7-7.4 2.1-1.7 13-1.7 13 0 0 .6-.7 5.2-1.5 10.2-.8 5-2.2 14.3-3.2 20.8L59.6 66H47.9l.6-3.2C51 47.3 51.4 43 50.2 43c-.4 0-3 2.9-5.7 6.5-2.8 3.5-5.4 6.3-5.9 6.1-.6-.1-2.5-3-4.4-6.4-1.9-3.4-3.7-6.2-4.2-6.2-.4 0-1.3 3.7-1.9 8.3C25.8 67.5 26.6 66 20 66h-5.7l3-20.2zM68.5 62.3c.3-2.1 1-5.8 1.5-8.3.5-2.5 1.7-9.9 2.6-16.5 1.9-14 2.9-15.7 8.8-15.3 4.4.3 4.2 0 13.9 15.8 2.1 3.4 4 6 4.2 5.8.2-.2 1-4.5 1.9-9.6.8-5.1 2-10 2.7-10.8.7-.8 2.9-1.4 5.5-1.4 5.2 0 5.1-.2 2.9 13.5-3.8 23.6-4.5 28.1-4.5 28.8 0 .4-2.2.7-4.9.7h-4.8l-6.9-11.1c-3.8-6.1-7.2-11.3-7.6-11.5-.7-.5-1.1 1.2-3.1 14.6l-1.3 8.5-5.7.3-5.8.3.6-3.8zM117.2 61.1c.5-2.5 1.9-11.7 3.2-20.4 1.3-8.7 3-16.4 3.6-17.2.9-1.1 3.6-1.5 11-1.5 8.4 0 10.1.3 13.1 2.3 1.8 1.2 3.9 3.4 4.6 4.7 1.5 3 1.7 10.9.3 13-.8 1.2-1 .9-1-1.3 0-1.8-1.1-3.9-2.9-5.8-2.6-2.6-3.6-2.9-9.4-2.9h-6.4l-1.7 10.8c-2.2 14.6-2.5 13.5 3.9 13 3-.3 5.5-.3 5.5-.2 0 .2-2 1.5-4.3 2.9-4.1 2.3-10.2 4.6-17.3 6.4l-3.1.8.9-4.6z" />
              <path d="m143.1 62.1c8.2-5.3 12.9-11 15.4-18.8 1.6-4.8 2-5.3 4.6-5.3 3.8 0 4.4 1.7 2.9 8-2.5 10.3-13.1 19-23.2 19h-4.2l4.5-2.9z" />
              <path d="M158.7 51.4c.3-.9 0-1.9-.6-2.4-1-.5-.8-1.9.4-5.8 2.2-6.6 1.4-13-2.3-17.3l-2.6-3.2 3.2 1.7c4 2.1 7.7 7 9.1 12.1 1.5 5.6 1.5 5.7-1.9 5-2.7-.6-3-.4-3 1.7 0 1.3-.3 3.3-.6 4.6-.5 1.6-.2 2.2 1 2.2.9 0 1.6.7 1.6 1.5 0 .9-.9 1.5-2.5 1.5-1.8 0-2.3-.4-1.8-1.6z" />
            </g>
          </svg>
          <svg
            className={styles.referenceIcon}
            fill="currentColor"
            version="1.1"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M14.281 0C6.411 0 0 6.324 0 14.094c0 2.383.621 4.707 1.781 6.781a23.531 23.531 0 0 0-.406 4.375c0 13 10.7 23.563 23.875 23.563 1.352 0 2.703-.09 4.031-.313 1.977.988 4.2 1.5 6.438 1.5C43.589 50 50 43.676 50 35.906c0-2.086-.46-4.078-1.344-5.937.32-1.535.5-3.121.5-4.719 0-12.996-10.73-23.563-23.906-23.563-1.238 0-2.488.094-3.719.282A14.316 14.316 0 0 0 14.281 0Zm10.813 9.375c2.047 0 3.84.223 5.343.688 1.508.46 2.786 1.074 3.782 1.843 1.008.778 1.777 1.606 2.25 2.469.476.871.718 1.758.718 2.594 0 .808-.343 1.515-.968 2.156-.625.64-1.41.969-2.344.969-.848 0-1.508-.196-1.969-.594-.43-.375-.883-.945-1.375-1.781-.57-1.07-1.238-1.942-2.031-2.532-.77-.574-2.078-.843-3.844-.843-1.64 0-2.98.297-3.968.937-.958.617-1.407 1.348-1.407 2.188 0 .515.16.941.469 1.312.328.39.762.715 1.344 1 .601.297 1.222.551 1.843.719.637.172 1.723.445 3.188.781 1.852.395 3.555.809 5.063 1.282 1.523.484 2.832 1.09 3.906 1.78 1.093.704 1.976 1.606 2.593 2.688.618 1.082.907 2.41.907 3.969-.004 1.86-.528 3.547-1.594 5.031-1.063 1.48-2.629 2.672-4.656 3.5-2.008.82-4.418 1.219-7.157 1.219-3.289 0-6.039-.559-8.187-1.688a10.706 10.706 0 0 1-3.781-3.312c-.977-1.383-1.469-2.738-1.469-4.063 0-.824.336-1.535.969-2.125.629-.578 1.418-.875 2.375-.875.785 0 1.48.227 2.031.688.531.441.98 1.098 1.344 1.938.406.917.84 1.667 1.312 2.28.446.583 1.082 1.087 1.907 1.47.828.39 1.964.593 3.343.593 1.895 0 3.43-.402 4.594-1.187 1.14-.766 1.719-1.684 1.719-2.813 0-.89-.313-1.61-.907-2.156-.625-.574-1.445-1.008-2.437-1.313-1.043-.316-2.441-.667-4.188-1.03-2.375-.505-4.394-1.11-6-1.782-1.644-.691-2.968-1.652-3.937-2.844-.984-1.215-1.5-2.71-1.5-4.5 0-1.707.527-3.27 1.563-4.593 1.019-1.313 2.511-2.333 4.437-3.032 1.898-.695 4.164-1.031 6.719-1.031Z" />
          </svg>
          <svg
            className={styles.referenceIcon}
            fill="none"
            version="1.1"
            viewBox="0 0 78 72.009"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m56.175 10.125h-32.095c-1.355 0-2.654-0.5334-3.613-1.4828-0.958-0.9494-1.496-2.237-1.496-3.5797 0-1.3426 0.538-2.6303 1.496-3.5796 0.959-0.9494 2.258-1.4828 3.613-1.4828h32.095c1.355 0 2.655 0.5334 3.613 1.4828 0.958 0.9493 1.497 2.237 1.497 3.5796 0 1.3427-0.539 2.6303-1.497 3.5797s-2.258 1.4828-3.613 1.4828zm-33.188 15.466h-13.224v5e-3c-1.355 0-2.655-0.534-3.613-1.483s-1.496-2.237-1.496-3.58c0-1.342 0.538-2.63 1.496-3.579 0.958-0.95 2.258-1.4831 3.613-1.4831h13.224c0.683-0.0197 1.364 0.0966 2.001 0.342 0.637 0.2451 1.217 0.6151 1.708 1.0871 0.49 0.472 0.88 1.036 1.146 1.66s0.403 1.294 0.403 1.971-0.137 1.348-0.403 1.972c-0.266 0.623-0.656 1.188-1.146 1.66-0.491 0.471-1.071 0.841-1.708 1.086-0.637 0.246-1.318 0.362-2.001 0.342zm5.096 25.876c-3e-3 -1.339-0.541-2.622-1.496-3.569s-2.249-1.481-3.6-1.485h-13.224c-1.355 0-2.655 0.533-3.613 1.483-0.958 0.949-1.496 2.237-1.496 3.579 0 1.343 0.538 2.631 1.496 3.58s2.258 1.483 3.613 1.483h13.224c1.354-5e-3 2.651-0.541 3.606-1.492 0.956-0.951 1.491-2.238 1.49-3.579zm48.415-19.043c0.957 0.947 1.497 2.231 1.502 3.572v8e-3c-2e-3 1.342-0.541 2.628-1.499 3.576s-2.256 1.481-3.61 1.482h-67.782c-1.355-1e-3 -2.655-0.535-3.613-1.485s-1.496-2.238-1.496-3.581c3e-3 -1.341 0.543-2.626 1.501-3.573 0.957-0.947 2.255-1.48 3.608-1.481h67.782c1.353 2e-3 2.65 0.535 3.607 1.482zm-20.314 29.46h-32.095c-1.355 0-2.655 0.533-3.613 1.483-0.958 0.949-1.497 2.237-1.497 3.579 0 1.343 0.539 2.631 1.497 3.58s2.258 1.483 3.613 1.483h32.095c1.355 0 2.654-0.534 3.613-1.483 0.958-0.949 1.496-2.237 1.496-3.58 0-1.342-0.538-2.63-1.496-3.579-0.959-0.95-2.258-1.483-3.613-1.483zm-4.774-37.777c-0.958-0.949-1.496-2.236-1.498-3.578 3e-3 -1.342 0.542-2.628 1.499-3.577 0.958-0.949 2.256-1.4832 3.611-1.4854h13.211c0.671 0 1.335 0.1309 1.955 0.3853 0.62 0.2541 1.183 0.6271 1.657 1.0971 0.475 0.47 0.851 1.028 1.108 1.643 0.257 0.614 0.389 1.272 0.389 1.937s-0.132 1.323-0.389 1.937-0.633 1.173-1.108 1.643c-0.474 0.47-1.037 0.843-1.657 1.097s-1.284 0.385-1.955 0.385h-13.211c-1.355-1e-3 -2.654-0.534-3.612-1.484z"
              clipRule="evenodd"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
          <svg
            className={styles.referenceIcon}
            fill="none"
            version="1.1"
            viewBox="0 0 555 66"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="currentColor">
              <path d="m400.32 0 58.299 2.0364e-5v9.6457h-23.978v54.801h-10.343v-54.801l-23.978-1e-5v-9.6457z" />
              <path d="m458.45 58.793c0 3.5515-2.947 6.4305-6.583 6.4305-3.635 0-6.582-2.879-6.582-6.4305 0-3.5514 2.947-6.4304 6.582-6.4304 3.636 0 6.583 2.879 6.583 6.4304z" />
              <path d="m555 64.447h-10.105v-64.447l10.105 3.5298e-6v64.447z" />
              <path d="m93.666 66c-19.427 0-34.59-14.667-34.59-33s15.163-33 34.59-33c19.428 6.7862e-6 34.59 14.667 34.59 33s-15.163 33-34.59 33zm0-9.625c12.984 0 23.692-9.2583 23.692-23.375 0-14.025-10.425-23.375-23.692-23.375-13.268 0-23.692 9.4417-23.692 23.467 0 14.117 10.709 23.283 23.692 23.283z" />
              <path d="m205.99 0 59.076 2.0636e-5v9.6671l-24.297-1e-5v54.78h-10.481v-54.78l-24.298-1e-5v-9.6671z" />
              <path d="m381.26 57.174v-57.174l10.5 3.668e-6v64.447h-18.233l-31.119-57.082v57.082h-10.501v-64.447l18.233 6.3689e-6 31.12 57.174z" />
              <path d="m186.94 57.174v-57.174l10.501 3.668e-6v64.447h-18.233l-31.119-57.082-1e-3 57.082h-10.5v-64.447l18.233 6.3689e-6 31.119 57.174z" />
              <path d="m537.9 64.447h-12.563l-26.303-64.447 11.778 4.114e-6 27.088 64.447z" />
              <path d="m273.61 64.447v-64.447l48.791 1.7043e-5v9.6671l-38.267-2e-5v16.572h35.397v9.667h-35.397v18.874h39.224v9.6671h-49.748z" />
              <rect width="10.882" height="64.447" />
              <path d="m478.82 64.449h-12.437l13.603-31.835h12.048l-13.214 31.835z" />
              <path d="m33.424 32.224 24.874 32.224h-13.603l-24.485-32.224 24.634-32.223 13.454 4.6996e-6 -24.874 32.223z" />
            </g>
          </svg>
          <svg
            className={styles.referenceIcon}
            version="1.1"
            viewBox="0 0 75.834 30.076"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m5.225 0h-3.286v3.3h3.286zm70.609 24.99v-17.741c0-0.757-0.647-1.352-1.508-1.352h-19.228c-0.808 0-1.508 0.595-1.508 1.352v15.796h3.285v3.3h17.397c0.915 0 1.562-0.596 1.562-1.353zm-11.742-9.898h-1.885v-1.947a0.522 0.522 0 0 0-0.485-0.541h-1.615c-0.162 0-0.485 0.108-0.485 0.54v6.005c0 0.378 0.27 0.54 0.485 0.54h1.615c0.216 0 0.485-0.162 0.485-0.54v-2.164h1.885v2.164c0 2.434-1.615 2.434-2.37 2.434h-2.315l-0.054-0.054c-1.077-0.162-1.616-0.974-1.616-2.38v-6.005c0-1.893 1.023-2.325 1.616-2.434h2.423c1.616 0 2.37 0.758 2.37 2.434v1.948zm7.702-2.543-3.931 7.087h3.931v1.893h-6.354v-1.731l3.985-7.249h-3.985v-1.893h6.409v1.893h-0.054z"
              fill="currentColor"
            />
            <path
              d="m31.668 5.896h-4.308v-5.896h-3.286v26.343h7.594c1.993 0 4.417-0.324 4.417-4.435v-11.468c-0.054-4.003-2.424-4.544-4.417-4.544zm1.078 16.012c0 1.027-0.862 1.136-1.132 1.136h-4.308v-13.848h4.308c0.27 0 1.131 0.216 1.131 1.244v11.468zm-16.535-16.012h-3.177c-1.993 0-4.417 0.54-4.417 4.544v11.467c0 4.112 2.424 4.436 4.417 4.436h3.177c1.993 0 4.417-0.324 4.417-4.436v-11.467c0-4.003-2.424-4.544-4.417-4.544zm1.131 16.011c0 1.028-0.861 1.137-1.13 1.137h-3.178c-0.27 0-1.131-0.109-1.131-1.137v-11.467c0-1.028 0.861-1.244 1.13-1.244h3.178c0.27 0 1.131 0.216 1.131 1.244zm32.854-9.628v-1.84c0-3.948-2.424-4.543-4.416-4.543h-2.37c-1.993 0-4.417 0.54-4.417 4.544v2.704c0 0.487 0.216 1.948 2.424 2.867l4.47 1.407s0.97 0.27 0.97 1.569v2.866c0 1.028-0.862 1.136-1.131 1.136h-2.37c-0.27 0-1.131-0.108-1.131-1.136v-2.11h-3.285v2.11c0 4.111 2.423 4.436 4.416 4.436h2.37c1.992 0 4.416-0.325 4.416-4.436v-3.787c0-1.243-0.485-2.487-2.908-3.407-2.424-0.92-4.309-1.406-4.524-1.514-0.216-0.163-0.431-0.433-0.431-1.19v-1.57c0-1.027 0.861-1.243 1.13-1.243h2.37c0.27 0 1.132 0.216 1.132 1.244v1.839h3.285zm-48.257 11.738c0 2.488-1.939 4.274-1.939 4.274l1.777 1.785s3.447-2.164 3.447-6.059v-18.121h-3.284v18.121z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
