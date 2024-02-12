const bcrypt = require('bcryptjs')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const password = bcrypt.hashSync('123456')
const userData = [
  { FirstName : 'andy', LastName: 'natikorn', PhoneNumber: '0489488', email: 'andy@ggg.mail', password: password, Address: 'somdet'},
  
]



const run = async () => {
  await prisma.user.createMany({
    data : userData
  })
}

run()
