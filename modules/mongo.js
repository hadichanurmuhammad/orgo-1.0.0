const mongoose = require('mongoose')


async function client() {
    return await mongoose.connect('mongodb+srv://hadicha:hadicha2006@cluster0.oiimv.mongodb.net/orgo?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}

module.exports = client