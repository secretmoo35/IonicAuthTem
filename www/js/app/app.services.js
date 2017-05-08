angular.module('your_app_name.app.services', [])

  .service('AuthService', function ($rootScope, $auth, $q) {

    this.login = function (user) {
      var dfd = $q.defer();
      $auth.login(user)
        .then(function (response) {
          window.localStorage.userData = JSON.stringify(response.data);
          dfd.resolve(response);
        })
        .catch(function (response) {
          dfd.reject(response);
        });
      return dfd.promise;
    };

    this.signup = function (user) {
      var dfd = $q.defer();
      $auth.signup(user)
        .then(function (response) {
          window.localStorage.userData = JSON.stringify(response.data);
          dfd.resolve(response);
        })
        .catch(function (response) {
          dfd.reject(response);
        });
      return dfd.promise;
    };

    // login facebook start
    var userData = $auth.getPayload();

    this.isAuthenticated = function () {
      return $auth.isAuthenticated();
    };

    this.authenticate = function (provider) {
      $auth
        .authenticate(provider)
        .then(this.successAuth)
        .catch(this.failedAuth);
    };

    // this.logOut = function () {
    //   $auth.logout();
    //   userData = undefined;

    //   $rootScope.$emit('userLoggedOut');
    // };

    this.successAuth = function (res) {
      userData = $auth.getPayload();
      window.localStorage.userData = JSON.stringify(res.data);
      $rootScope.$emit('userLoggedIn', { data: res.data });
    };

    this.failedAuth = function () {
      userData = undefined;
      $rootScope.$emit('userFailedLogin');
    };

    // login facebook end

    this.getUser = function () {
      return window.localStorage.userData ? JSON.parse(window.localStorage.userData) : null;
    };

    this.logOut = function () {
      window.localStorage.removeItem('userData');
    }

  })

  .service('PostService', function ($http, $q) {

    this.getPostComments = function (post) {
      var dfd = $q.defer();

      $http.get('database.json').success(function (database) {
        var comments_users = database.users;

        // Randomize comments users array
        comments_users = window.knuthShuffle(comments_users.slice(0, post.comments));

        var comments_list = [];
        // Append comment text to comments list
        comments_list = _.map(comments_users, function (user) {
          var comment = {
            user: user,
            text: database.comments[Math.floor(Math.random() * database.comments.length)].comment
          };
          return comment;
        });

        dfd.resolve(comments_list);
      });

      return dfd.promise;
    };

    this.getUserDetails = function (userId) {
      var dfd = $q.defer();

      $http.get('database.json').success(function (database) {
        //find the user
        var user = _.find(database.users, function (user) { return user._id == userId; });
        dfd.resolve(user);
      });

      return dfd.promise;
    };

    this.getUserPosts = function (userId) {
      var dfd = $q.defer();

      $http.get('database.json').success(function (database) {

        //get user posts
        var userPosts = _.filter(database.posts, function (post) { return post.userId == userId; });
        //sort posts by published date
        var sorted_posts = _.sortBy(userPosts, function (post) { return new Date(post.date); });

        //find the user
        var user = _.find(database.users, function (user) { return user._id == userId; });

        //add user data to posts
        var posts = _.each(sorted_posts.reverse(), function (post) {
          post.user = user;
          return post;
        });

        dfd.resolve(posts);
      });

      return dfd.promise;
    };

    this.getUserLikes = function (userId) {
      var dfd = $q.defer();

      $http.get('database.json').success(function (database) {
        //get user likes
        //we will get all the posts
        var slicedLikes = database.posts.slice(0, 4);
        // var sortedLikes =  _.sortBy(database.posts, function(post){ return new Date(post.date); });
        var sortedLikes = _.sortBy(slicedLikes, function (post) { return new Date(post.date); });

        //add user data to posts
        var likes = _.each(sortedLikes.reverse(), function (post) {
          post.user = _.find(database.users, function (user) { return user._id == post.userId; });
          return post;
        });

        dfd.resolve(likes);

      });

      return dfd.promise;

    };

    this.getFeed = function (page) {

      var pageSize = 5, // set your page size, which is number of records per page
        skip = pageSize * (page - 1),
        totalPosts = 1,
        totalPages = 1,
        dfd = $q.defer();

      $http.get('database.json').success(function (database) {

        totalPosts = database.posts.length;
        totalPages = totalPosts / pageSize;

        var sortedPosts = _.sortBy(database.posts, function (post) { return new Date(post.date); }),
          postsToShow = sortedPosts.slice(skip, skip + pageSize);

        //add user data to posts
        var posts = _.each(postsToShow.reverse(), function (post) {
          post.user = _.find(database.users, function (user) { return user._id == post.userId; });
          return post;
        });

        dfd.resolve({
          posts: posts,
          totalPages: totalPages
        });
      });

      return dfd.promise;
    };
  })

  .service('ShopService', function ($http, $q, _) {

    this.getProducts = function () {
      var dfd = $q.defer();
      $http.get('database.json').success(function (database) {
        dfd.resolve(database.products);
      });
      return dfd.promise;
    };

    this.getProduct = function (productId) {
      var dfd = $q.defer();
      $http.get('database.json').success(function (database) {
        var product = _.find(database.products, function (product) { return product._id == productId; });

        dfd.resolve(product);
      });
      return dfd.promise;
    };

    this.addProductToCart = function (productToAdd) {
      var cart_products = !_.isUndefined(window.localStorage.ionTheme1_cart) ? JSON.parse(window.localStorage.ionTheme1_cart) : [];

      //check if this product is already saved
      var existing_product = _.find(cart_products, function (product) { return product._id == productToAdd._id; });

      if (!existing_product) {
        cart_products.push(productToAdd);
      }

      window.localStorage.ionTheme1_cart = JSON.stringify(cart_products);
    };

    this.getCartProducts = function () {
      return JSON.parse(window.localStorage.ionTheme1_cart || '[]');
    };

    this.removeProductFromCart = function (productToRemove) {
      var cart_products = JSON.parse(window.localStorage.ionTheme1_cart);

      var new_cart_products = _.reject(cart_products, function (product) { return product._id == productToRemove._id; });

      window.localStorage.ionTheme1_cart = JSON.stringify(new_cart_products);
    };

  })




  ;
