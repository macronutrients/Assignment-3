import { defineConfig } from 'vite'//gets our config from defineconfig to allow for the setup of vite
import react from '@vitejs/plugin-react' //now with this our vite knows that our project uses react
import tailwindcss from"@tailwindcss/vite"; //tailwind has to also be mentioned for styling. 


export default defineConfig({ //exports vite settings for later readings
  plugins: [react(), tailwindcss()] //the switch is flipped here for the react and the tailwind plugin
});
