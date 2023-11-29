export default () => ({
    secret: process.env.JWT_SECRET || 'defaultSecret',
    expiresIn: '24h',
  });
  