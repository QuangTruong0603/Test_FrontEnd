var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/signup", {
      templateUrl: "app/views/signup.html",
      controller: "SignupController",
    })
    .when("/login", {
      templateUrl: "app/views/login.html",
      controller: "LoginController",
    })
    .when("/order", {
      templateUrl: "app/views/order.html",
      controller: "OrderController",
    })
    .otherwise({
      redirectTo: "app/views/signup", // Chuyển hướng đến trang đăng ký mặc định
    });
});

app.controller("SignupController", function ($scope, $http, $location, $route) {
  $scope.user = {};
  $scope.message = "";

  $scope.signup = function () {
    var data = {
        email: $scope.user.email,
        password: $scope.user.password,
      };
  
      $http({
        method: "POST",
        url: "http://localhost:3000/auth/local/signup",
        data: $.param(data),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }).then(
        function (response) {
          $("#exampleModal").modal("show");
        },
        function (error) {
          console.error(error);
        }
      );
  };
  $scope.verifyOtp = function () {
    if ($scope.otpCode) {
      const otpData = {
        email: $scope.user.email,
        otp: $scope.otpCode,
      };

      $http
        .post("http://localhost:3000/auth/local/verify-signup-otp", otpData)
        .then(function (response) {
          alert("Sign up successful");
          $("#exampleModal").modal("hide");
        //   localStorage.setItem("access_token", response.data.access_token);
        //   localStorage.setItem("refresh_token", response.data.refresh_token);
        window.location.href = "#!/login";
          window.location.reload();
        })
        .catch(function (error) {
          console.error("OTP verification failed:", error);
        });
    } else {
      alert("Please enter the OTP code.");
    }
  };
});

app.controller("LoginController", function ($scope, $http, $location, $route) {
  $scope.user = {};
  $scope.message = "";

  $scope.login = function () {
    var data = {
      email: $scope.user.email,
      password: $scope.user.password,
    };

    $http({
      method: "POST",
      url: "http://localhost:3000/auth/local/signin",
      data: $.param(data),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then(
      function (response) {
        $("#exampleModal").modal("show");
      },
      function (error) {
        console.error(error);
      }
    );
  };

  $scope.verifyOtp = function () {
    if ($scope.otpCode) {
      const otpData = {
        email: $scope.user.email,
        otp: $scope.otpCode,
      };

      $http
        .post("http://localhost:3000/auth/local/verify-signin-otp", otpData)
        .then(function (response) {
          alert("Login successful");
          $("#exampleModal").modal("hide");
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          window.location.href = "#!/order";
          window.location.reload();
        })
        .catch(function (error) {
          console.error("OTP verification failed:", error);
        });
    } else {
      alert("Please enter the OTP code.");
    }
  };
});

app.controller("OrderController", function ($scope, $http){

});

app.controller("NavController", function($scope, $window) {
    var token = localStorage.getItem("access_token");
            $scope.isLoggedIn = !!token;

            if ($scope.isLoggedIn) {
                try {
                    var decodedToken = jwt_decode(token); 
                    $scope.userEmail = decodedToken.email;
                } catch (error) {
                    console.error("Invalid token", error);
                }
            }

    $scope.logout = function() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_email");
        $window.location.href = "#!/login";
        $scope.isLoggedIn = false;
    };
});
