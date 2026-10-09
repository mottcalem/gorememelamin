import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{baseURL:'http://127.0.0.1:5173',launchOptions:{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'},headless:true},reporter:'list'});
