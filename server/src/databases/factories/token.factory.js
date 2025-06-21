const { faker } = require('@faker-js/faker/locale/id_ID');
const jwtUtil = require('../../utils/jwt.util');

class TokenFactory {
    static create(overrides = {}) {
        // Generate a random token if one isn't provided in overrides
        const generateToken = async (userId) => {
            if (overrides.token) return overrides.token;

            try {
                // Use JWT util if available, otherwise generate a fake token
                if (jwtUtil && jwtUtil.sign) {
                    return await jwtUtil.sign({ userId });
                } else {
                    return faker.string.alphanumeric(128);
                }
            } catch (error) {
                return faker.string.alphanumeric(128);
            }
        };

        const userId = overrides.userId || faker.string.uuid();

        const defaultAttributes = async () => ({
            userId: userId,
            token: await generateToken(userId),
        });

        return {
            ...defaultAttributes(),
            ...overrides,
        };
    }

    static createMany(count = 1, overrides = {}) {
        return Promise.all(
            Array.from({ length: count }, () => this.create(overrides))
        );
    }
}

module.exports = TokenFactory; 