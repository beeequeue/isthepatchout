declare module "*.vue" {
  import { DefineComponent } from "vue"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

declare module "@ivanv/vue-collapse-transition" {
  import { Component } from "vue"

  type CollapseTransitionProps = {
    dimension?: "height" | "width"
    name?: string
    duration?: number
    easing?: string
  }

  const CollapseTransition: Component<CollapseTransitionProps>

  export default CollapseTransition
}

declare module "simple-icons/icons/*" {
  import { SimpleIcon } from "simple-icons"

  const icon: SimpleIcon

  export = icon
}
