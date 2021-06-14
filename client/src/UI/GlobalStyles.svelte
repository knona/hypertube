<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @font-face {
    font-family: 'manrope';
    font-weight: 700;
    font-style: normal;
    src: url('Resources/Fonts/bold.otf') format('otf');
  }

  @font-face {
    font-family: 'manrope';
    font-weight: 300;
    font-style: normal;
    src: url('Resources/Fonts/light.otf') format('otf');
  }

  @font-face {
    font-family: 'manrope';
    font-weight: 500;
    font-style: normal;
    src: url('Resources/Fonts/medium.otf') format('otf');
  }

  @font-face {
    font-family: 'manrope';
    font-weight: 400;
    font-style: normal;
    src: url('Resources/Fonts/regular.otf') format('otf');
  }

  @font-face {
    font-family: 'manrope';
    font-weight: 600;
    font-style: normal;
    src: url('Resources/Fonts/semibold.otf') format('otf');
  }

  @font-face {
    font-family: 'manrope';
    font-weight: 200;
    font-style: normal;
    src: url('Resources/Fonts/thin.otf') format('otf');
  }

  body {
    margin: 0px;
    padding: 0px;

    color: white;
    font-family: manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;

    background-color: #0e0e0e;
  }

  svg {
    fill: currentColor;
  }

  .comment-width {
    max-width: 700px;
  }

  @layer utilities {
    .box {
      @apply bg-secondary-bg rounded-lg;
    }

    .padding-box {
      @apply p-8 box;
    }

    .v-stack {
      @apply flex flex-col;
    }

    .h-stack {
      @apply flex flex-row;
    }

    .center-content {
      @apply flex items-center justify-center;
    }

    .page-padding {
      @apply px-8;
    }

    .hoverable {
      @apply transition-opacity duration-300 opacity-0;
    }

    .max-width {
      @apply max-w-6xl m-auto;
    }

    .player-button {
      @apply cursor-pointer text-white opacity-90 hover:opacity-100 transition ease-in-out;
    }

    .absolute-center {
      @apply absolute m-auto left-0 right-0 top-0 bottom-0;
    }
  }
</style>
