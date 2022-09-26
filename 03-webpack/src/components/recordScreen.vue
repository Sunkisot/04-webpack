<template>
  <section>
    <div style="position: fixed; right: 0; top: 45%">
      <button @click="get_start()">点击录制</button>
      <button @click="get_end()">点击暂停</button>
      <button @click="playback()">点击播放</button>
      <button @click="save()">点击上传</button>
    </div>
    <div id="playback"></div>
  </section>
</template>

<script>
import * as rrweb from 'rrweb'
import rrwebPlayer from 'rrweb-player'
var eventsMatrix = []
export default {
  name: 'recordScreen',
  data () {
    return {}
  },
  methods: {
    get_start () {
      // rrwebMin 为启动对象
      // record() 方法启动录制
      // emit会监听所有的DOM的动作， 鼠标等，
      rrweb.record({
        emit (event, isCheckout) {
          // 用任意方式存  储 event
          // isCheckout 是一个标识，告诉你重新制作了快照
          eventsMatrix.push(event)
          // if (isCheckout) {
          //   eventsMatrix.push([]);
          // }
          // const lastEvents = eventsMatrix[eventsMatrix.length - 1];
          // lastEvents.push(event);
        }
        // checkoutEveryNth: 200, // 每 200 个 event 重新制作快照
        // checkoutEveryNms: 5 * 60 * 1000, // 每5分钟重新制作快照
      })
      alert('正在录制')
    },
    get_end () {
      const stopFn = rrweb.record({
        emit (event) {
          if (eventsMatrix.length > 100) {
            stopFn()
          }
        }
      })
    },
    async save () {
      const body = JSON.stringify({ eventsMatrix })
      console.log('body', body)
      eventsMatrix = []
      // let res = await saveMovieFile(body)
    },
    playback () {
      // this.replayer.on('start', () => {
      //   debugger
      // })
      document.getElementById('playback').innerHTML = ''
      new rrwebPlayer({
        target: document.getElementById('playback'), // 可以自定义 DOM 元素
        data: {
          events: eventsMatrix
        }
      })
      // this.replayer = new rrweb.Replayer(eventsMatrix, {
      //   root: document.getElementById("box"),
      //   speed: 1,
      // });
      // //播放
      // this.replayer.play();

      // // 从第 3 秒的内容开始播放
      // replayer.play(3000);

      // // 暂停
      // replayer.pause();

      // // 暂停至第 5 秒处
      // replayer.pause(5000);
    }
  },
  created () {}
}
</script>

<style>
</style>
