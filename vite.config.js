import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        aiAgency: resolve(__dirname, 'project-ai-agency.html'),
        construction: resolve(__dirname, 'project-construction.html'),
        creditRepair: resolve(__dirname, 'project-credit-repair.html'),
        dubaiVisa: resolve(__dirname, 'project-dubai-visa.html'),
        gccf: resolve(__dirname, 'project-gccf.html'),
        llcBusiness: resolve(__dirname, 'project-llc-business.html'),
        realEstate: resolve(__dirname, 'project-real-estate.html')
      }
    }
  }
});
