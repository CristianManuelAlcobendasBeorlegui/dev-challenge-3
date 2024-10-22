<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login/Register in application</title>
  <meta name="description" content="DevChallenge Login/Register application">
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  <link rel="stylesheet" href="{{ asset('css/tabler-io/webfont/tabler-icons.min.css') }}">
  <script src="{{ asset('js/auth-form.js') }}"></script>

  <!-- <meta http-equiv="refresh" content="5"> -->

  @vite(['resources/js/app.js'])
</head>
<body>
  <section class="section section--auth">
    <div class="auth__information">
      <picture class="auth__picture">
        <img class="auth__image auth__image--main" src="{{ asset('img/login.png') }}" alt="Authentication form icon">
      </picture>
      <p class="auth__description"><span class="featured-word">Login</span> into application to see what's waiting for you or <span class="featured-word">register</span> an account if you don't have one!</p>
    </div>
    <div class="auth__main">
      <div class="auth__options">
        <button id="button-sign-in" class="auth__option active">Sign in</button>
        <button id="button-sign-up" class="auth__option">Sign up</button>
      </div>
      
      <div class="auth__forms">
        <!-- Login form -->
        <div id="login" class="auth__form auth__form--login active">
          <form action="{{ route('login') }}" method="POST" id="login-form" class="form form--login" name="login">
            @csrf

            <h1 class="form__title">Sign in</h1>

            <div class="form__input-boxes">
              <div class="form__input-box">
                <div class="input-box__field">
                  <input type="text" name="email" placeholder="Email" id="login-form__email" class="field__input" autocomplete="username">
                  <i class="field__icon ti ti-mail-filled"></i>  
                </div>
                <div class="input-box__status input-box__status--error">
                  @php($messages = $errors->get('email'))
                  @if ($messages)
                      <ul class="error__list-items">
                          @foreach ((array) $messages as $message)
                              <li class="error__list-item">{{ $message }}</li>
                          @endforeach
                      </ul>
                  @endif
                </div>
              </div>
              <div class="form__input-box">
                <div class="input-box__field">
                  <input type="password" name="password" placeholder="Password" id="login-form__password" class="field__input" autocomplete="current-password">
                  <i class="field__icon ti ti-lock-filled"></i>  
                </div>
                <div class="input-box__status input-box__status--error">
                  @php($messages = $errors->get('password'))
                  @if ($messages)
                      <ul class="error__list-items">
                          @foreach ((array) $messages as $message)
                              <li class="error__list-item">{{ $message }}</li>
                          @endforeach
                      </ul>
                  @endif
                </div>
              </div>
            </div>
            <div class="form__help-items">
              <div class="form__help-item form__help-item--left">
                <div class="input__field">
                  <input type="checkbox" name="remember" id="remember-me">
                  <label for="remember-me" class="">Remember me</label>
                </div>
              </div>
              <div class="form__help-item form__help-item--right">
                <a href="{{ route('password.request') }}" class="help-item__anchor">Forgot password?</a>
              </div>
            </div>
            <div class="form__options">
              <button type="submit" class="submit-btn">
                <span>Sign in</span>
                <i class="submit-btn__icon ti ti-arrow-right"></i>
              </button>
            </div>
          </form>

          <div class="oauth">
            <span class="oauth__information">or you can</span>
            <div class="oauth__providers">
              <a href="#" class="oauth__provider" title="Login with Google" aria-label="Login with Google"><i class="oauth__icon ti ti-brand-google-filled"></i></a>
              <a href="#" class="oauth__provider" title="Login with GitHub" aria-label="Login with GitHub"><i class="oauth__icon ti ti-brand-github"></i></a>
            </div>
          </div>
        </div>

        <!-- Register form -->
        <div id="register" class="auth__form auth__form--register">
          <form action="{{ route('register') }}" method="POST" name="register" id="register-form" class="form form--register">
            @csrf

            <h1 class="form__title">Create an account</h1>

            <div class="form__input-boxes">
            <div class="form__input-box">
                <div class="input-box__field">
                  <input type="text" name="name" placeholder="Full name" autocomplete="name" id="register-form__name" class="field__input">
                  <i class="field__icon ti ti-user-filled"></i>
                </div>
                <div class="input-box__status input-box__status--error">
                  @php($messages = $errors->get('name'))
                  @if ($messages)
                      <ul class="error__list-items">
                          @foreach ((array) $messages as $message)
                              <li class="error__list-item">{{ $message }}</li>
                          @endforeach
                      </ul>
                  @endif
                </div>
              </div>
              <div class="form__input-box">
                <div class="input-box__field">
                  <input type="text" name="email" placeholder="Email" autocomplete="email" id="register-form__email" class="field__input">
                  <i class="field__icon ti ti-mail-filled"></i>
                </div>
                <div class="input-box__status input-box__status--error">
                  @php($messages = $errors->get('email'))
                  @if ($messages)
                      <ul class="error__list-items">
                          @foreach ((array) $messages as $message)
                              <li class="error__list-item">{{ $message }}</li>
                          @endforeach
                      </ul>
                  @endif
                </div>
              </div>
              <div class="form__input-box">
                <div class="input-box__field">
                  <input type="password" name="password" placeholder="Password" autocomplete="password" id="register-form__password" class="field__input">
                  <i class="field__icon ti ti-lock-filled"></i>
                </div>
                <div class="input-box__status input-box__status--error">
                  @php($messages = $errors->get('password'))
                  @if ($messages)
                      <ul class="error__list-items">
                          @foreach ((array) $messages as $message)
                              <li class="error__list-item">{{ $message }}</li>
                          @endforeach
                      </ul>
                  @endif
                </div>
              </div>
              <div class="form__input-box">
                <div class="input-box__field">
                  <input type="password" name="password_confirmation" placeholder="Confirm password" autocomplete="password-repeat" id="register-form__password-repeat" class="field__input">
                  <i class="field__icon ti ti-lock-filled"></i>
                </div>
                <div class="input-box__status input-box__status--error">
                  @php($messages = $errors->get('password__confirmation'))
                  @if ($messages)
                      <ul class="error__list-items">
                          @foreach ((array) $messages as $message)
                              <li class="error__list-item">{{ $message }}</li>
                          @endforeach
                      </ul>
                  @endif
                </div>
              </div>
            </div>

            <div class="form__options">
              <button type="submit" class="submit-btn">
                Sign up
                <i class="submit-btn__icon ti ti-arrow-right"></i>
              </button>
            </div>
          </form>

          <!-- <div class="oauth">
            <span class="oauth__information">or you can register using</span>

            <div class="oauth__providers">
              <a href="#" class="oauth__provider"><i class="oauth__icon ti ti-brand-google-filled"></i></a>
              <a href="#" class="oauth__provider"><i class="oauth__icon ti ti-brand-github"></i></a>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </section>
</body>
</html>