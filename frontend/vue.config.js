module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://backend:5001',
                changeOrigin: true
            }
        }
    }
};