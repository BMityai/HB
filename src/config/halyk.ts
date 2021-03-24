const halykConfig = {
    /**
     * 
     */
    scope: process.env.HALYK_SCOPE as string,
    clientId: process.env.HALYK_CLIENT_ID as string,
    key: process.env.HALYK_CLIENT_SECRET as string,
    getTokenUrl: process.env.HALYK_GET_TOKEN_URL as string,
    baseurl: process.env.HALYK_BASE_URL as string,
};

export default halykConfig;
