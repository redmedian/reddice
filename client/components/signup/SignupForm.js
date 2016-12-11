import React from 'react';
import timezones from '../../data/timezone';
import map from 'lodash/map';
import classnames from 'classnames';
import validateInput from '../../../server/shared/validations/signup';
import TextFieldGroup from '../common/TextFieldGroup';

class SignupForm extends React.Component {
  // коструктор. определяем состояние
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      timezone: '',
      errors: {},
      isLoading: false,
      invalid: false
    }

    /*
    * Биндим this
    * Вместо записи onChange={this.onChange.bind(this)}
    */
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkUserExists = this.checkUserExists.bind(this);
  }

  // Event
  onChange(e) {
    // this.setState({ username: e.target.value })
    this.setState({ [e.target.name]: e.target.value })
  }

  // Функция isValid, используется для валидации полей в форме
  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  // Проверка уникальности пользоваеля на клиенте
  checkUserExists(e) {
    const field = e.target.name;
    const val = e.target.value;
    if (val !== '') {
      this.props.isUserExists(val).then(res => {
        let errors = this.state.errors;
        let invalid;
        if (res.data.user) {
          errors[field] = 'There is user with such ' + field;
          invalid = true;
        } else {
          errors[field] = '';
          invalid = false;
        }
        this.setState({ errors, invalid });
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    // выполняем условие if для клиентской валидации
    // if (true) - отключает клиентскую валидацию, остаётся только серверная валидация
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      // axios.post('/api/users', { user: this.state });
      this.props.userSignupRequest(this.state).then(
        () => {
          // выводим flashMessage
          this.props.addFlashMessage({
            type: 'success',
            text: 'You signed up successfuly. Welcome!'
          });
          // После успеной авторизации редиректим в корень проекта
          this.context.router.push('/');
      },
      // ловим ошибки валидации с серверной части и передаем их в клиентскую часть
      (error) => this.setState({ errors: error.response.data, isLoading: false })
    );﻿
    // console.log(this.state);
    }
  }

  render() {
    // Константа errors, выводит на сайт ошибку валидации
    const { errors } = this.state;
    // Константа options используется в селекте Timezone. Используем библиотеку lodash
    const options = map(timezones, (val, key) =>
      <option key={val} value={val}>{key}</option>
    );
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Join our community!</h1>

        <TextFieldGroup
          error={errors.username}
          label="Username"
          onChange={this.onChange}
          checkUserExists={this.checkUserExists}
          value={this.state.username}
          field="username"
        />

        <TextFieldGroup
          error={errors.email}
          label="Email"
          onChange={this.onChange}
          checkUserExists={this.checkUserExists}
          value={this.state.email}
          field="email"
        />

        <TextFieldGroup
          error={errors.password}
          label="Password"
          onChange={this.onChange}
          value={this.state.password}
          field="password"
          type="password"
        />

        <TextFieldGroup
          error={errors.passwordConfirmation}
          label="Password Confirmation"
          onChange={this.onChange}
          value={this.state.passwordConfirmation}
          field="passwordConfirmation"
          type="password"
        />

        <div className={classnames("form-group", { 'has-error': errors.timezone })}>
          <label className="control-label">Timezone</label>
          <select
            className="form-control"
            name="timezone"
            onChange={this.onChange}
            value={this.state.timezone}
          >
            <option value="" disabled>Choose Your Timezone</option>
            {options}
          </select>
          {errors.timezone && <span className="help-block">{errors.timezone}</span>}
        </div>

        <div className="form-group">
          <button disabled={this.state.isLoading || this.state.invalid} className="btn btn-primary btn-lg">
            Sign up
          </button>
        </div>

      </form>
    );
  }
}

// TODO Хрен пока знает как работает. Нужно разобраться!
SignupForm.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
}

// Провайдер для обработки this.context.router.push('/');
// TODO Разобраться как работает
SignupForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default SignupForm;
