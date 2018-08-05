var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const ListingModel = sequelize.define('Listings', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model: 'Users',
            key: 'user_id'
        }
    },
    name: {
        type: Sequelize.STRING,
        trim: true
    },
    imagename:{
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        trim: true
    },
    status:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0
    },
    category:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Clothing'
    }
});
//force: true will drop the table if its already exists
ListingModel.sync({force: false, logging: console.log}).then(() => {
    //Table created
    console.log("Listings table synced");
    ListingModel.upsert({
        id:1,
        user_id: 1,
        name: "Vans Old Skool - Size 10.0 Men",
        imagename:"vans.jpg",
        description: "Vans The Old Skool, Vans classic skate shoe and the first to bare the iconic side stripe, has a low-top lace-up silhouette with a durable suede and canvas upper with padded tongue and lining and Vans signature Waffle Outsole.",
        price: 60.00,
        status: 0,
        category: 'Shoes'
    });
    ListingModel.upsert({
        id:2,
        user_id: 2,
        name: "YEEZY 500 “Super Moon Yellow”",
        imagename:"yeezy.jpg",
        description: "Yeezy 500 Super Moon Yellow features an upper constructed from cow suede, premium leather and mesh with nubuck accents.",
        price: 320.00,
        status: 1,
        category: 'Shoes'
    });
});
ListingModel.upsert({
    id:3,
    user_id: 2,
    name: "MCM Munich Lion Intarsia Sweater",
    imagename: "MHA8AMM17BK00M_01.png",
    description: "Impactful yet easy to wear, it styles effortlessly for casual wear or a fun night out.",
    price: 783.29,
    status: 1,
    category: 'Clothing'
});
ListingModel.upsert({
    id:4,
    user_id: 3,
    name: "NEW ROLEX DEEPSEA BASELWORLD 2018 BLUE",
    imagename: "Rolex-Deepsea-D-Blue-20181.jpg",
    description: "The watch of the deep is equipped with the cutting-edge calibre 3235 and introduces a redesigned case with a broader bracelet and resized Oysterlock folding safety clasp.",
    price: 16940.00,
    status: 0,
    category: 'Watches'
});
ListingModel.upsert({
    id:5,
    user_id: 5,
    name: "CASIO Beach Traveler Series BGA-250-7A1",
    imagename: "30830104_427336567717672_1722993845244788736_n.jpg",
    description: "These new BABY-G models are just the thing for a wide variety of summertime travel and beach activities.",
    price: 159.00,
    status: 0,
    category: 'Watches'
});
ListingModel.upsert({
    id:6,
    user_id: 4,
    name: "FILA Men's and Women's Disruptor 2",
    imagename: "FS1HTA1071X_WWT_grande.jpg",
    description: "You’ll definitely be disrupting the usual parade of sneakers on the streets with this chunky ’90s model out of the archives.",
    price: 320.00,
    status: 0,
    category: 'Shoes'
});
ListingModel.upsert({
    id:7,
    user_id: 5,
    name: "Valentino Techno Cotton Jersey Jacket",
    imagename: "valentino-NAVY-Techno-Cotton-Jersey-Jacket.jpeg",
    description: "Helmed by Mr Pierpaolo Piccioli, Valentino 's most recent collections have a sporty energy. This Italian-made blouson jacket is cut slim from smooth jersey and detailed with striped ribbed trims that recall old-school track styles.",
    price: 1770.00,
    status: 1,
    category: 'Clothing'
});
ListingModel.upsert({
    id:8,
    user_id: 1,
    name: "Off-White c/o Virgil Abloh Men's Red Checked Cotton",
    imagename: "off-white-co-virgil-abloh-All-Over-White-Red-Check-Over-Jacket.jpeg",
    description: "Off-White c/o Virgil Abloh's red and multicolored checked cotton-blend shirt jacket is embroidered at the back with white “Off-WhiteTM Check White” lettering.",
    price: 1591,
    status: 1,
    category: 'Clothing'
});
ListingModel.upsert({
    id:9,
    user_id: 4,
    name: "Pandora MOMENTS SLIDING LEATHER BRACELET, BLACK",
    imagename: "pandora-moments-sliding-black-leather-bracelet-597225cbk-p72726-431588_zoom.jpg",
    description: "This updated version of the leather charm bracelet is crafted from black leather and finished with an adjustable sterling silver bolo closure.",
    price: 99.00,
    status: 1,
    category: 'Jewellery'
});
ListingModel.upsert({
    id:10,
    user_id: 3,
    name: "Chanel Spring Summer 2018 Earrings Metal Glass",
    imagename: "earrings-silver-blue-pearly-white-metal-glass-strass-resin-packshot-default-a45908y47181z5819-8802090614814.jpg",
    description: "Metal, Glass, Strass & Resin",
    price: 570,
    status: 0,
    category: 'Jewellery'
});

module.exports = sequelize.model('Listings', ListingModel)