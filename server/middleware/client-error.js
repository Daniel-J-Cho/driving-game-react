class ClientError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'ClientError';
    }
}

export { ClientError };
