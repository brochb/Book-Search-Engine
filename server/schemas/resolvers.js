const { User, Books } = require('../models');
const { authMiddleware, signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, args, context) => {
            // Use authMiddleware to check for authentication
            const currentUser = await authMiddleware(context);

            if (!currentUser) {
                throw new Error('Not authenticated');
            }

            return currentUser;
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            // Implement your logic to authenticate and return an Auth type
            const user = await User.findOne({ email });

            if (!user || !(await user.isCorrectPassword(password))) {
                throw new Error('Invalid email or password');
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            // Implement your logic to add a user and return an Auth type
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        // Implement other mutation functions
    },
};

module.exports = resolvers;
