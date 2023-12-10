const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks');

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: { savedBooks: bookData },
                    },
                    { new: true }
                )
                return updatedUser;
            }
            throw AuthenticationError;
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            if (!user) {
                throw AuthenticationError
            }
            const token = signToken(user);
            return { token, user }
        },

        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                );
                return updatedUser
            }
            throw AuthenticationError
        }
    },
};

module.exports = resolvers;