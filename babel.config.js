const plugins = [
  [
    "component",
    {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-chalk"
    }
  ]
];
if (['production', 'prod'].includes(process.env.NODE_ENV)) {
  // plugins.push("transform-remove-console")
}

module.exports = {
  presets: [
    '@vue/app',
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry",
        "modules": false
      }
    ]
  ],
  "plugins": plugins
}
