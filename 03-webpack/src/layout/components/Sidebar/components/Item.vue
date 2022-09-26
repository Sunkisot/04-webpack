<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { icon, title } = context.props;
    return [
      h("svg-icon", {
        style: {
          display: icon ? "inline-block" : "none",
        },
        props: {
          "icon-class": icon,
        },
      }),
      h(
        "span",
        {
          display: title ? "inline-block" : "none",
          slot: 'title'
        },
        title
      ),
    ];
    
  },
};
</script>
