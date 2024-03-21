const authRoutes = require("./authRoutes")
const companyRoutes = require("./companyRoutes")
const userRoutes = require("./userRoutes")
const employeeRoutes = require("./employeeRoutes")
const leavesRoutes = require("./leavesRoutes")
const transactionRoutes = require("./transactionRoutes")
const accountRoutes = require("./accountRoutes")
const statementRoutes = require("./statementRoutes")
const salaryRoutes = require("./salaryRoutes")
const loanRoutes = require("./loanRoutes")
const itemRoutes = require("./itemRoutes");
const inventoryRoutes = require('../routes/inventoryRoutes')
const purchaseRoutes = require('../routes/purchaseRoutes')

const routes = [
    {
        path: '/auth',
        component: authRoutes
    },
    {
        path: '/companies',
        component: companyRoutes
    },
    {
        path: '/user',
        component: userRoutes
    },
    {
        path: '/employee',
        component: employeeRoutes
    },
    {
        path: '/leaves',
        component: leavesRoutes
    },
    {
        path: '/accounts',
        component: accountRoutes
    },
    {
        path: '/transaction',
        component: transactionRoutes
    },
    {
        path: '/statement',
        component: statementRoutes
    },
    {
        path: '/salary',
        component: salaryRoutes
    },
    {
        path: '/loans',
        component: loanRoutes
    },
    {
        path: '/items',
        component: itemRoutes
    },
    {
        path: '/intevtory',
        component: inventoryRoutes
    },
    {
        path: '/purchase-item',
        component: purchaseRoutes
    },
]

const loadRoutes = (app) => {
    routes.forEach(route => {
        app.use(route.path, route.component);
    })
}

module.exports = loadRoutes