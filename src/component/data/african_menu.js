const nigerianFoods = [
  {
    id: 1,
    name: "Nigerian Jollof Rice",
    price: 14.99,
    description:
      "An iconic, spicy, tomato-based one-pot rice dish that is a staple at every Nigerian celebration.",
    image:
      "https://i.pinimg.com/1200x/a7/4b/cb/a74bcb0ac99a32475e945016731d8d39.jpg",
    category: "Rice Dishes",
  },
  {
    id: 2,
    name: "Egusi Soup",
    price: 15.99,
    description:
      "A rich, nutritious soup made with ground melon seeds, vegetables, and assorted meat or fish.",
    image:
      "https://i.pinimg.com/1200x/06/91/5b/06915b6a2ea976f5fb450f76a0786ce0.jpg",
    category: "Soups & Stews",
  },
  {
    id: 3,
    name: "Pounded Yam",
    price: 6.99,
    description:
      "A smooth, dough-like swallow made by pounding boiled yam until it achieves a stretchy consistency.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Pounded_yam_and_egusi_soup.jpg",
    category: "Swallow",
  },
  {
    id: 4,
    name: "Efo Riro",
    price: 16.49,
    description:
      "A rich, savory vegetable soup prepared with spinach, locust beans, and assorted proteins.",
    image:
      "https://i.pinimg.com/1200x/7e/4f/99/7e4f996e0c5fd99c5115460361b7289d.jpg",
    category: "Soups & Stews",
  },
  {
    id: 5,
    name: "Moi Moi",
    price: 5.99,
    description:
      "A steamed bean pudding made from peeled black-eyed peas, onions, and fresh ground peppers.",
    image:
      "https://i.pinimg.com/736x/1c/2c/20/1c2c209e5d6325af0dcfe76ff3ed28d1.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 6,
    name: "Akara",
    price: 4.99,
    description:
      "Deep-fried bean cakes made from blended black-eyed peas, often eaten as a breakfast snack.",
    image:
      "https://i.pinimg.com/1200x/b9/a8/3f/b9a83f208a128db62ff78c621cb7b6cb.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 7,
    name: "Suya",
    price: 12.99,
    description:
      "Spicy, skewered, and grilled meat, typically beef, coated in a peanut-spice rub called yaji.",
    image:
      "https://i.pinimg.com/736x/49/7d/df/497ddfdfb9f827dabdb838d457e7e2f6.jpg",
    category: "Grills & Proteins",
  },
  {
    id: 8,
    name: "Ogbono Soup",
    price: 14.99,
    description:
      "A viscous, draw-soup made from ground wild mango seeds, often paired with swallow.",
    image:
      "https://i.pinimg.com/736x/4a/c6/73/4ac673710b7768d1ce5c1ec0a1fb5ac2.jpg",
    category: "Soups & Stews",
  },
  {
    id: 9,
    name: "Fried Rice",
    price: 13.99,
    description:
      "A colorful stir-fried rice dish featuring mixed vegetables, liver, shrimp, and curry powder.",
    image:
      "https://i.pinimg.com/1200x/24/76/9f/24769ff2863b60d7e094ea7c856e78c9.jpg",
    category: "Rice Dishes",
  },
  {
    id: 10,
    name: "Banga Soup",
    price: 17.99,
    description:
      "A traditional soup from the Niger Delta made from palm nut fruit extract and aromatic spices.",
    image:
      "https://i.pinimg.com/1200x/7e/55/f1/7e55f1617b5478f67a92cb2e2ed908f4.jpg",
    category: "Soups & Stews",
  },
  {
    id: 11,
    name: "Eba",
    price: 4.99,
    description:
      "A firm swallow made from garri (dried fermented cassava flour) and hot water.",
    image:
      "https://i.pinimg.com/1200x/9e/ca/35/9eca352b6349d0103365cc8c5e2e5ee1.jpg",
    category: "Swallow",
  },
  {
    id: 12,
    name: "Amala",
    price: 5.49,
    description:
      "A dark, soft swallow made from dried yam or cassava flour, popular in Yoruba cuisine.",
    image:
      "https://i.pinimg.com/736x/5d/18/c8/5d18c8f3a6face69b8dd1ab49d5a5c9c.jpg",
    category: "Swallow",
  },
  {
    id: 13,
    name: "Okra Soup",
    price: 13.49,
    description:
      "A healthy, draw-soup made from chopped okra, leafy greens, and assorted meats.",
    image:
      "https://i.pinimg.com/736x/93/d0/8e/93d08e9a33f3f67e900a0ab6d4dbceba.jpg",
    category: "Soups & Stews",
  },
  {
    id: 14,
    name: "Meat Pie",
    price: 3.99,
    description:
      "A flaky, golden pastry filled with minced meat, carrots, and potatoes.",
    image:
      "https://i.pinimg.com/1200x/32/73/21/32732134fee2f05905366757ca0bd46c.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 15,
    name: "Puff Puff",
    price: 2.99,
    description:
      "Sweet, deep-fried dough balls, widely popular as a street food snack.",
    image:
      "https://i.pinimg.com/1200x/2f/76/32/2f7632d52764d0c6f22dcc093897fa32.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 16,
    name: "Edikang Ikong",
    price: 18.99,
    description:
      "A nutritious soup from the Efik/Ibibio people made with pumpkin leaves and waterleaf.",
    image:
      "https://i.pinimg.com/1200x/7b/c0/e1/7bc0e17d79db92e285db49d121b322ba.jpg",
    category: "Soups & Stews",
  },
  {
    id: 17,
    name: "Goat Meat Pepper Soup",
    price: 15.99,
    description:
      "A spicy, light broth cooked with goat meat and aromatic local herbs and spices.",
    image:
      "https://i.pinimg.com/736x/6d/a6/e9/6da6e961315b1d65fd7e97d92a87bf51.jpg",
    category: "Soups & Stews",
  },
  {
    id: 18,
    name: "Yam Porridge",
    price: 11.99,
    description:
      "A comforting meal made by boiling yam chunks in a spicy palm oil and vegetable base.",
    image:
      "https://i.pinimg.com/1200x/7f/2b/5d/7f2b5d7b177744f0a6829eb86ab00dbc.jpg",
    category: "Porridges & Legumes",
  },
  {
    id: 19,
    name: "Ewa Agoyin",
    price: 9.99,
    description: "Mashed beans served with a spicy, dark, fried pepper sauce.",
    image:
      "https://i.pinimg.com/736x/f6/c4/42/f6c44273df280db2cec077b3051b117f.jpg",
    category: "Porridges & Legumes",
  },
  {
    id: 20,
    name: "Plantain Chips",
    price: 2.49,
    description: "Thinly sliced, crunchy fried plantains, seasoned with salt.",
    image:
      "https://i.pinimg.com/736x/c4/ae/0b/c4ae0b19fb73a6453934a31b68ca6264.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 21,
    name: "Boli",
    price: 4.49,
    description:
      "Roasted plantain, usually served with groundnuts or pepper sauce.",
    image:
      "https://i.pinimg.com/736x/ee/29/46/ee29469f3a6c281d9cb2a52c7220fb51.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 22,
    name: "Kilishi",
    price: 14.99,
    description: "A spicy, dried meat jerky, popular in Northern Nigeria.",
    image:
      "https://i.pinimg.com/736x/7a/0c/4d/7a0c4d4cedb3cbbec0f334756d739759.jpg",
    category: "Grills & Proteins",
  },
  {
    id: 23,
    name: "Ofada Rice and Stew",
    price: 16.99,
    description:
      "Unpolished local rice served with a spicy, fermented locust bean stew.",
    image:
      "https://i.pinimg.com/736x/97/1d/81/971d81795ad4792e63857dc753ecf76d.jpg",
    category: "Rice Dishes",
  },
  {
    id: 24,
    name: "Bitterleaf Soup",
    price: 14.49,
    description:
      "A traditional soup made with washed bitter leaves, cocoyam, and stockfish.",
    image: "https://i.pinimg.com/736x/9a/82/2b/9a822b858f4b32a7e6a6817b3bd15fd2.jpg",
    category: "Soups & Stews",
  },
  {
    id: 25,
    name: "Chin Chin",
    price: 3.49,
    description:
      "A crunchy, fried snack made from a dough of flour, sugar, and milk.",
    image:
      "https://i.pinimg.com/1200x/19/f9/44/19f944bc3bec0a211c00c85b46e3769d.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 26,
    name: "Fufu",
    price: 4.99,
    description: "A classic swallow made from fermented cassava.",
    image:
      "https://i.pinimg.com/1200x/02/19/30/021930f4f4db44be03462b646f7cfefa.jpg",
    category: "Swallow",
  },
  {
    id: 27,
    name: "Tuwo Shinkafa",
    price: 5.99,
    description: "A soft, sticky swallow made from short-grain rice.",
    image:
      "https://i.pinimg.com/1200x/cb/80/96/cb809653430645643d89c56a82968555.jpg",
    category: "Swallow",
  },
  {
    id: 28,
    name: "Oha Soup",
    price: 15.49,
    description:
      "A seasonal soup made with tender Oha leaves, cocoyam, and stockfish.",
    image:
      "https://i.pinimg.com/736x/ef/0a/94/ef0a949136a9744c5a37fcc4164ea651.jpg",
    category: "Soups & Stews",
  },
  {
    id: 29,
    name: "Semovita",
    price: 4.99,
    description:
      "A swallow made from semolina flour, cooked until smooth and firm.",
    image:
      "https://i.pinimg.com/736x/13/ef/cc/13efcc9cadbbac960c8130eb070e065c.jpg",
    category: "Swallow",
  },
  {
    id: 30,
    name: "Peppered Gizzard",
    price: 11.99,
    description:
      "Chicken gizzards fried and tossed in a spicy, onion-rich pepper sauce.",
    image:
      "https://i.pinimg.com/736x/3a/f7/1b/3af71bc0c5d61ae9cdcc0b55c2c770be.jpg",
    category: "Grills & Proteins",
  },
  {
    id: 31,
    name: "Scotch Egg",
    price: 4.49,
    description:
      "A boiled egg wrapped in sausage meat and breadcrumbs, then deep-fried.",
    image:
      "https://i.pinimg.com/1200x/d9/be/c2/d9bec2cf27c37157c9a6b2b462cd54c4.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 32,
    name: "Garden Egg Sauce",
    price: 10.99,
    description:
      "A savory sauce made with mashed garden eggs (eggplant), palm oil, and crayfish, eaten with yam.",
    image:
      "https://i.pinimg.com/736x/b9/7e/a1/b97ea14d0c7ed4496650c7af8f9a05bb.jpg",
    category: "Soups & Stews",
  },
  {
    id: 33,
    name: "Fish Roll",
    price: 3.49,
    description: "A deep-fried pastry snack with a savory fish filling.",
    image:
      "https://i.pinimg.com/1200x/dc/16/b5/dc16b5ef54dc27131fa0f6fe6dd70f2b.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 34,
    name: "Zobo",
    price: 3.0,
    description:
      "A refreshing crimson drink made from dried hibiscus flowers, ginger, and fruits.",
    image:
      "https://i.pinimg.com/1200x/fa/4a/8e/fa4a8ec95b0a9b3b41e1038b12850bfc.jpg",
    category: "Beverages",
  },
  {
    id: 35,
    name: "Kunun Zaki",
    price: 3.5,
    description:
      "A traditional Northern Nigerian non-alcoholic fermented drink made from millet or sorghum.",
    image:
      "https://i.pinimg.com/736x/a2/7d/e1/a27de1a5b1b0049db220933b81ec91b1.jpg",
    category: "Beverages",
  },
  {
    id: 36,
    name: "Masa",
    price: 5.49,
    description:
      "A fermented rice cake, pan-fried to create a light, fluffy texture.",
    image:
      "https://i.pinimg.com/1200x/47/2a/10/472a10bc8bba6458481f2956c0e830d0.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 37,
    name: "Danwake",
    price: 8.99,
    description:
      "Flour dumplings served with spicy oil and seasoning, popular in the North.",
    image:
      "https://i.pinimg.com/736x/29/23/1d/29231d2645dea046d4cdc161151be1b4.jpg",
    category: "Sides & Breakfast",
  },
  {
    id: 38,
    name: "Coconut Rice",
    price: 14.49,
    description:
      "Rice cooked in creamy coconut milk for a rich, aromatic flavor.",
    image:
      "https://i.pinimg.com/736x/00/b5/21/00b521b71e6ecf7663d0eb6cad00e46e.jpg",
    category: "Rice Dishes",
  },
  {
    id: 39,
    name: "Gizdodo",
    price: 13.99,
    description:
      "A popular party dish combining fried gizzards and fried plantains in a pepper sauce.",
    image:
      "https://i.pinimg.com/1200x/2b/b8/88/2bb888c5a28181551675dd2eaae8abfc.jpg",
    category: "Grills & Proteins",
  },
  {
    id: 40,
    name: "Akamu (Pap)",
    price: 3.99,
    description:
      "A fermented corn pudding/porridge served hot, often with moi moi or akara.",
    image:
      "https://i.pinimg.com/736x/f6/24/b7/f624b7a0da1e216e072ee0e60d09d186.jpg",
    category: "Sides & Breakfast",
  },
  {
    id: 41,
    name: "Egg Roll",
    price: 3.49,
    description: "A boiled egg wrapped in dough and deep-fried.",
    image:
      "https://i.pinimg.com/736x/ca/ca/e8/cacae86a5e7a1cbfa049b03b88dd3f25.jpg",
    category: "Snacks & Pastries",
  },
  {
    id: 42,
    name: "Peppered Snails",
    price: 18.99,
    description:
      "Cooked snails sautéed in a rich, spicy, onion and pepper base.",
    image:
      "https://i.pinimg.com/1200x/0f/50/47/0f50476c71fec48fe5ed200ef691e82e.jpg",
    category: "Grills & Proteins",
  },
  {
    id: 43,
    name: "Spaghetti Jollof",
    price: 11.99,
    description:
      "Spaghetti cooked in the same spicy tomato-based stew as Jollof rice.",
    image:
      "https://i.pinimg.com/736x/b0/e7/b9/b0e7b9d20d18478bb0daed2f63417784.jpg",
    category: "Sides & Breakfast",
  },
  {
    id: 44,
    name: "Groundnut Soup",
    price: 13.99,
    description:
      "A thick, savory soup made from ground peanuts, meat, and vegetables.",
    image:
      "https://i.pinimg.com/1200x/72/f7/45/72f745507203d20c3ef9dfad6df38e6b.jpg",
    category: "Soups & Stews",
  },
  {
    id: 45,
    name: "Fried Plantain (Dodo)",
    price: 4.99,
    description: "Ripe plantains sliced and fried until golden brown.",
    image:
      "http://i.pinimg.com/736x/de/1a/1d/de1a1d9f9a533c49b49ee90f644a5dec.jpg",
    category: "Sides & Breakfast",
  },
  {
    id: 46,
    name: "Egg Sauce",
    price: 7.99,
    description:
      "Scrambled eggs cooked with tomatoes, onions, and peppers, often served with boiled yam.",
    image:
      "https://i.pinimg.com/1200x/f1/09/93/f10993f5da07b71323b7afb07905bdb7.jpg",
    category: "Sides & Breakfast",
  },
  {
    id: 47,
    name: "Agidi",
    price: 3.99,
    description: "A solid corn flour pudding, usually wrapped in leaves.",
    image:
      "https://i.pinimg.com/736x/11/0f/1c/110f1c85d1af317a95615bb784883a3b.jpg",
    category: "Sides & Breakfast",
  },
  {
    id: 48,
    name: "Fisherman Soup",
    price: 19.99,
    description:
      "A diverse seafood soup from the riverine areas, packed with fish, crabs, and periwinkles.",
    image:
      "https://i.pinimg.com/1200x/48/3b/ab/483babcce70224ab98e129ddcc615f60.jpg",
    category: "Soups & Stews",
  },
  {
    id: 49,
    name: "Tuwo Masara",
    price: 5.49,
    description:
      "A stiff swallow made from cornmeal, popular in Northern Nigeria.",
    image:
      "https://i.pinimg.com/736x/db/28/5a/db285a12ba7b0454bdcac68c636e36e6.jpg",
    category: "Swallow",
  },
  {
    id: 50,
    name: "Fried Yam",
    price: 5.99,
    description:
      "Chunks of yam deep-fried until crispy on the outside and soft inside.",
    image:
      "https://i.pinimg.com/736x/36/a3/e3/36a3e3ea54a00bc79e8dd772a6da1f9c.jpg",
    category: "Sides & Breakfast",
  },
  {
    id: 51,
    name: "Ewa Riro",
    price: 9.49,
    description:
      "A savory bean porridge cooked with palm oil, locust beans, and crayfish.",
    image:
      "https://i.pinimg.com/736x/8c/2f/2d/8c2f2d3350a12242afb3c50e20b62523.jpg",
    category: "Porridges & Legumes",
  },
  {
    id: 52,
    name: "Peppered Beef",
    price: 12.49,
    description: "Fried beef cubes tossed in a fiery hot pepper sauce.",
    image:
      "https://i.pinimg.com/736x/a8/47/65/a8476529eda5db6a750b4bee95cc5009.jpg",
    category: "Grills & Proteins",
  },
  {
    id: 53,
    name: "Catfish Pepper Soup",
    price: 16.99,
    description:
      "A spicy, fragrant broth featuring catfish, a favorite for evening relaxation.",
    image:
      "https://i.pinimg.com/1200x/a7/c0/60/a7c0602a0f46b41f3488f3c7b0f545d3.jpg",
    category: "Soups & Stews",
  },
  {
    id: 54,
    name: "Ayamase",
    price: 16.99,
    description:
      "A spicy green pepper stew made with bleached palm oil, served with Ofada rice.",
    image:
      "https://i.pinimg.com/1200x/4d/69/69/4d6969dcfc827bd5bfb0415774b32a4d.jpg",
    category: "Soups & Stews",
  },
  {
    id: 55,
    name: "Fura da Nono",
    price: 4.5,
    description:
      "A drink made from fermented cow milk (nono) and millet dough balls (fura).",
    image:
      "https://i.pinimg.com/736x/85/df/60/85df60d33434277b296217f99f230d4d.jpg",
    category: "Beverages",
  },
  {
    id: 56,
    name: "Tomato Stew",
    price: 11.49,
    description:
      "A basic, versatile stew made from blended tomatoes and peppers, served with rice or yam.",
    image:
      "https://i.pinimg.com/736x/53/93/0a/53930af7763748f58aa672397c9ddde3.jpg",
    category: "Soups & Stews",
  },
  {
    id: 57,
    name: "Beans and Plantain",
    price: 10.99,
    description:
      "A classic combination of cooked beans and fried or boiled plantains.",
    image:
      "https://i.pinimg.com/736x/fb/2b/e9/fb2be9e164523ef6384022d2f1d1454e.jpg",
    category: "Porridges & Legumes",
  },
  {
    id: 58,
    name: "Plantain Porridge",
    price: 11.49,
    description:
      "Unripe or semi-ripe plantains cooked in a savory broth with vegetables.",
    image:
      "https://i.pinimg.com/736x/a9/03/dd/a903dd092f5321fb4eb73f0e3f0d663d.jpg",
    category: "Porridges & Legumes",
  },
  {
    id: 59,
    name: "Peppered Chicken",
    price: 12.99,
    description:
      "Fried chicken pieces coated in a spicy, flavorful pepper sauce.",
    image:
      "https://i.pinimg.com/1200x/3f/45/db/3f45db70abeaa44c8fa120e3b147f3f4.jpg",
    category: "Grills & Proteins",
  },
  {
    id: 60,
    name: "Stockfish Stew",
    price: 15.99,
    description:
      "A savory stew featuring rehydrated stockfish (dried cod) in tomato sauce.",
    image:
      "https://i.pinimg.com/1200x/3d/d9/33/3dd933d4be6f24e825e48d197d53ffa9.jpg",
    category: "Soups & Stews",
  },
  {
    id: 61,
    name: "Miyan Taushe",
    price: 14.99,
    description:
      "A pumpkin-based soup from Northern Nigeria, typically eaten with rice swallow.",
    image:
      "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&auto=format&fit=crop&q=80",
    category: "Soups & Stews",
  },
  {
    id: 62,
    name: "Fried Fish",
    price: 11.99,
    description:
      "Crispy fried fish, seasoned with garlic, onions, and local spices.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 63,
    name: "Pumpkin Soup (Ugu)",
    price: 12.99,
    description: "Nutritious vegetable soup made from pumpkin leaves.",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80",
    category: "Soups & Stews",
  },
  {
    id: 64,
    name: "Ewedu Soup",
    price: 9.99,
    description:
      "A slimy but delicious soup made from jute leaves, often paired with gbegiri.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Ewedu_soup.jpg",
    category: "Soups & Stews",
  },
  {
    id: 65,
    name: "Gbegiri Soup",
    price: 9.99,
    description:
      "A bean-based soup made from peeled brown beans, smooth and creamy.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/Amala_with_Gbegiri_and_Ewedu_Soup.jpg",
    category: "Soups & Stews",
  },
  {
    id: 66,
    name: "Afang Soup",
    price: 17.99,
    description:
      "A rich vegetable soup from the Efik/Ibibio people made with Okazi leaves and waterleaf.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Afang_Soup_Platter.jpg",
    category: "Soups & Stews",
  },
  {
    id: 67,
    name: "White Rice",
    price: 6.99,
    description:
      "Simple boiled rice, the base for many Nigerian stews and sauces.",
    image:
      "https://images.unsplash.com/photo-1516685018646-549198525c1b?w=600&auto=format&fit=crop&q=80",
    category: "Rice Dishes",
  },
  {
    id: 68,
    name: "Peppered Turkey",
    price: 14.99,
    description:
      "Fried turkey parts tossed in a spicy tomato and pepper reduction.",
    image:
      "https://images.unsplash.com/photo-1516100882582-76c9a141d630?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 69,
    name: "Meat Roll",
    price: 3.99,
    description:
      "A snack similar to a sausage roll but with a distinct, spicy minced meat filling.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    category: "Snacks & Pastries",
  },
  {
    id: 70,
    name: "Roasted Corn",
    price: 2.99,
    description:
      "Fire-roasted corn on the cob, usually enjoyed with pear (ube).",
    image:
      "https://images.unsplash.com/photo-1551754625-70c904aa395f?w=600&auto=format&fit=crop&q=80",
    category: "Snacks & Pastries",
  },
  {
    id: 71,
    name: "Potato Porridge",
    price: 10.49,
    description: "Sweet potatoes cooked in a savory, spicy tomato-based stew.",
    image:
      "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80",
    category: "Porridges & Legumes",
  },
  {
    id: 72,
    name: "Fried Potato",
    price: 5.49,
    description:
      "Deep-fried potato wedges or chunks, served as a side or main dish.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 73,
    name: "Peppered Ponmo",
    price: 8.99,
    description: "Boiled and fried cow skin (ponmo) in a spicy pepper sauce.",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 74,
    name: "Uziza Soup",
    price: 15.99,
    description:
      "A fragrant, spicy soup flavored with ground Uziza leaves and seeds.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80",
    category: "Soups & Stews",
  },
  {
    id: 75,
    name: "Miyan Kuka",
    price: 13.49,
    description:
      "A traditional Northern soup made from powdered baobab leaves.",
    image:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    category: "Soups & Stews",
  },
  {
    id: 76,
    name: "Tuwo",
    price: 5.49,
    description:
      "A general term for various starchy swallows made from grains.",
    image:
      "https://images.unsplash.com/photo-1516685018646-549198525c1b?w=600&auto=format&fit=crop&q=80",
    category: "Swallow",
  },
  {
    id: 77,
    name: "Grilled Tilapia",
    price: 16.99,
    description: "Whole tilapia fish, spiced and grilled until tender.",
    image:
      "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 78,
    name: "Waterleaf Soup",
    price: 11.99,
    description: "A soup featuring waterleaf as the main vegetable.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    category: "Soups & Stews",
  },
  {
    id: 79,
    name: "Fried Shaki",
    price: 10.99,
    description:
      "Tripe (shaki) boiled until tender and then fried with peppers.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 80,
    name: "Chapman",
    price: 4.5,
    description:
      "A popular Nigerian cocktail made from fruity syrups, bitters, and lemon-lime soda.",
    image:
      "https://images.pexels.com/photos/12392943/pexels-photo-12392943.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Beverages",
  },
  {
    id: 81,
    name: "Palm Oil Rice",
    price: 9.99,
    description:
      "Rice cooked with palm oil and local spices for a native flavor.",
    image:
      "https://images.unsplash.com/photo-1701014159309-4a8b8400335a?w=600&auto=format&fit=crop&q=80",
    category: "Rice Dishes",
  },
  {
    id: 82,
    name: "Fried Egg",
    price: 3.99,
    description: "Simple fried egg, a common breakfast side.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 83,
    name: "Tea and Bread",
    price: 5.99,
    description:
      "A staple Nigerian breakfast of buttered bread and sweetened tea.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 84,
    name: "Akara and Bread",
    price: 6.49,
    description:
      "A popular breakfast sandwich made by stuffing akara inside sliced bread.",
    image:
      "https://images.pexels.com/photos/14875151/pexels-photo-14875151.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Sides & Breakfast",
  },
  {
    id: 85,
    name: "Plantain and Egg",
    price: 8.49,
    description: "Fried plantains served with fried or scrambled eggs.",
    image:
      "https://images.unsplash.com/photo-1620921553530-a3821374c2bc?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 86,
    name: "Fried Corn",
    price: 4.99,
    description: "Sweet corn kernels stir-fried with vegetables.",
    image:
      "https://images.unsplash.com/photo-1536511132770-f4705a6e8bfa?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 87,
    name: "Scrambled Egg",
    price: 4.49,
    description: "Eggs whisked and cooked with onions and chili peppers.",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 88,
    name: "Groundnut Stew",
    price: 12.99,
    description:
      "A thick, creamy stew made with groundnuts (peanuts) and meat.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    category: "Soups & Stews",
  },
  {
    id: 89,
    name: "Palm Oil Yam",
    price: 6.99,
    description: "Boiled yam served with fresh palm oil and dried chili.",
    image:
      "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 90,
    name: "Suya Spiced Chicken",
    price: 13.99,
    description: "Chicken wings or pieces marinated in suya spice and grilled.",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 91,
    name: "Omelette",
    price: 5.49,
    description:
      "A folded egg dish filled with diced tomatoes, peppers, and onions.",
    image:
      "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 92,
    name: "Smoked Fish",
    price: 9.99,
    description:
      "Fish that has been cured by smoke, used as a flavor base in many soups.",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 93,
    name: "Noodles",
    price: 6.49,
    description:
      "Instant noodles cooked with vegetables, eggs, and local spices.",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    category: "Sides & Breakfast",
  },
  {
    id: 94,
    name: "Fried Beef",
    price: 10.49,
    description:
      "Beef pieces seasoned and deep-fried to create a crunchy snack or side.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 95,
    name: "Stewed Fish",
    price: 13.99,
    description: "Fried fish simmered in a rich, spicy tomato-based stew.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
    category: "Soups & Stews",
  },
  {
    id: 96,
    name: "Stewed Chicken",
    price: 14.49,
    description:
      "Chicken pieces cooked thoroughly in a thick, savory tomato stew.",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
    category: "Soups & Stews",
  },
  {
    id: 97,
    name: "Roasted Plantain and Fish",
    price: 15.99,
    description:
      "A classic pairing of Boli and grilled fish, served with pepper sauce.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/29/Roasted_plantain%2C_roasted_fish_and_pepper_sauce.jpg",
    category: "Grills & Proteins",
  },
  {
    id: 98,
    name: "Bean Porridge",
    price: 9.99,
    description:
      "Beans cooked until soft in a palm oil, onion, and pepper base.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Nigerian_Beans_Porridge.jpg",
    category: "Porridges & Legumes",
  },
  {
    id: 99,
    name: "Fried Snail",
    price: 16.99,
    description:
      "Snails seasoned and fried in oil, often served as a delicacy.",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    category: "Grills & Proteins",
  },
  {
    id: 100,
    name: "Kunu",
    price: 3.5,
    description:
      "A variety of grain-based non-alcoholic drinks from Northern Nigeria.",
    image:
      "https://images.pexels.com/photos/5947039/pexels-photo-5947039.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Beverages",
  },
];

export default nigerianFoods;
