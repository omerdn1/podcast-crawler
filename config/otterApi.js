import OtterApi from 'otter.ai-api';

require('dotenv').config();

const otterApi = new OtterApi({
  email: process.env.OTTER_EMAIL,
  password: process.env.OTTER_PASSWORD,
});

export default otterApi;
