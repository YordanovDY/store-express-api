const PORT = 3030;
const SALT_ROUNDS = 10;
const AUTH_COOKIE_NAME = 'Auth';
const ROLES = {
    Customer: '679fbd1793b3d9dc7102fe0a',
    StoreManager: '679fbea793b3d9dc7102fe0c',
    Supplier: '679fbee593b3d9dc7102fe0e',
    Admin: '679fbf1b93b3d9dc7102fe10'
};


export {
    PORT,
    SALT_ROUNDS,
    AUTH_COOKIE_NAME,
    ROLES
}