<script>
export default {
  onLaunch() {
    if (import.meta.env.DEV) console.log('App Launch')
  },
  onShow() {
    if (import.meta.env.DEV) console.log('App Show')
  },
  onHide() {
    if (import.meta.env.DEV) console.log('App Hide')
  }
}
</script>

<style>
/*每个页面公共css */
</style>
