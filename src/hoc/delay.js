import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import config from '../config'
import { curry } from '../utils/func'

export default curry(
  (defaultDelay, Origin) =>
    class extends PureComponent {
      static propTypes = {
        delay: PropTypes.number,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.any,
      }

      constructor(props) {
        super(props)

        this.state = {
          value: props.value,
        }

        this.handleChange = this.handleChange.bind(this)
        this.forceChange = this.forceChange.bind(this)
        this.cancelChange = this.cancelChange.bind(this)
      }

      getValue() {
        if (this.changeLocked) return this.state.value
        return this.props.value
      }

      getDelay() {
        const { delay } = this.props
        if (delay !== undefined) return delay
        if (config.delay !== undefined) return config.delay
        return defaultDelay
      }

      handleChange(value, ...args) {
        const delay = this.getDelay()
        if (delay === 0) {
          this.props.onChange(value, ...args)
          return
        }

        this.setState({ value })

        this.changeLocked = true
        this.forceUpdate()
        if (this.changeTimer) clearTimeout(this.changeTimer)
        this.changeTimer = setTimeout(() => {
          this.changeLocked = false
          this.props.onChange(value, ...args)
        }, delay)
      }

      cancelChange() {
        if (this.changeTimer) clearTimeout(this.changeTimer)
      }

      forceChange(value, ...args) {
        this.setState({ value })
        this.props.onChange(value, ...args)
        this.changeLocked = false
      }

      render() {
        const { value, onChange, ...props } = this.props
        return (
          <Origin
            {...props}
            value={this.getValue()}
            onChange={this.handleChange}
            forceChange={this.forceChange}
            cancelChange={this.cancelChange}
          />
        )
      }
    }
)
