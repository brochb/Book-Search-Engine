const { User, Book } = require('../models');
const { authMiddleware, signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async ( parent, args, context) => {
            // Use authMiddleware to check for authentication
            const currentUser = await authMiddleware(context);

            if (!currentUser) {
                throw new Error('Not authenticated');
            }

            const userData = await User.findOne({ _id: currentUser._id })
                .select('-__v -password')
                .populate('savedBooks');

            return userData;
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user || !(await user.isCorrectPassword(password))) {
                throw new Error('Invalid email or password');
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (_, { bookData }, context) => {
            const currentUser = await authMiddleware(context);

            if (!currentUser) {
                throw new Error('Not authenticated');
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: currentUser._id },
                {
                    $addToSet: { savedBooks: bookData },
                },
                { new: true }
            );

            return updatedUser;
        },

        removeBook: async (_, { bookId }, context) => {
            const currentUser = await authMiddleware(context);

            if (!currentUser) {
                throw new Error('Not authenticated');
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: currentUser._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );

            return updatedUser;
        },
    },
};


module.exports = resolvers;
