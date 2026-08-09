import env from '#start/env'

export default {
  delaySeconds: env.get('DELAY_SECONDS'),
}
