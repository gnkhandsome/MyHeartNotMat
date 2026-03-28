Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    message: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: '✓'
    },
    duration: {
      type: Number,
      value: 2000
    }
  },

  observers: {
    visible(newVal) {
      if (newVal) {
        this.startTimer();
      }
    }
  },

  data: {
    timer: null
  },

  methods: {
    startTimer() {
      if (this.data.timer) {
        clearTimeout(this.data.timer);
      }

      const timer = setTimeout(() => {
        this.setData({ visible: false });
      }, this.data.duration);

      this.setData({ timer });
    },

    show(options = {}) {
      const {
        message = '',
        icon = '✓',
        duration = 2000
      } = options;

      this.setData({
        visible: true,
        message,
        icon,
        duration
      });
    },

    hide() {
      this.setData({ visible: false });
    }
  },

  detached() {
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
  }
});