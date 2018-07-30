//META{"name":"hexColorPreview"}*//

class hexColorPreview {
  constructor() {
    this.whatever = "whatever";
  }

  wrapAll() {
    let self = this;
    setTimeout(function () {
      let regHex = new RegExp(/#(?:[0-9a-fA-F]{3}){1,2}\b/, 'g');
      $(".da-markup").each(function () {
        if ($(this).find(".hex-value").length) return;
        if ($(this).text().match(regHex) !== null) {
          $(this).html(function (_, html) {
            let text = self.settings.textColor ? `style="color: $&;"` : '';
            let preview = self.settings.previewPopup ? `<div class="hex-preview" style="background: $&;"></div>` : '';
            let wrap = `<div class="hex-value" ${text}>$&${preview}</div>`;
            return html.replace(regHex, wrap);
          });
        }
      });
    }, 100);
  }

  cleanUp() {
    $(".hex-value").each(function () {
      $(this).replaceWith(function () {
        return $(this).text();
      });
    });
  }

  updateStyle() {
    let self = this;
    let css = `
      .hex-value {
        position: relative;
        display: inline-block;
        font-weight: bold;
      }

      .hex-value .hex-preview {
        visibility: hidden;
        height: ${self.settings.previewSize}px;
        width: ${self.settings.previewSize}px;
        border-radius: 15%;

        position: absolute;
        z-index: 100;
        top: -10px;
        left: 105%;

        opacity: 0;
        transition: opacity 0.5s;
      }

      .hex-value:hover .hex-preview {
        visibility: visible;
        opacity: 1;
      }
    `;

    if ($("#hexPreview-stylesheet").length) {
      $("#hexPreview-stylesheet").html(css);
    } else {
      BdApi.injectCSS("hexPreview-stylesheet", css);
    }
  }

  inject(name, options) {
    let element = document.getElementById(options.id);
    if (element) element.parentElement.removeChild(element);
    element = document.createElement(name);
    for (let attr in options)
      element.setAttribute(attr, options[attr]);
    document.head.appendChild(element);
    return element;
  }

  initialize() {
    PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/kaloncpu57/discord-plugins/master/hexColorPreview.plugin.js");

    this.loadSettings();
    this.updateStyle();
    this.wrapAll();
  }

  start() {
    let libraryScript = this.inject('script', {
      type: 'text/javascript',
      id: 'zeresLibraryScript',
      src: 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js'
    });

    if (typeof window.ZeresLibrary !== "undefined") {
      this.initialize();
    } else {
      libraryScript.addEventListener("load", () => { this.initialize(); });
    }
  }

  observer({ addedNodes }) {
    if(addedNodes.length && addedNodes[0].classList && addedNodes[0].classList.contains('chat')
    || addedNodes.length && addedNodes[0].classList && addedNodes[0].classList.contains('da-markup')
    || addedNodes.length && addedNodes[0].classList && addedNodes[0].classList.contains('message')
    || addedNodes.length && addedNodes[0].classList && addedNodes[0].classList.contains('hide-overflow')
    || addedNodes.length && addedNodes[0].classList && addedNodes[0].classList.contains('messages-wrapper')) {
      this.wrapAll();
    }
  }

  get defaultSettings() {
    return {
      previewSize: 25,
      textColor: true,
      previewPopup: true
    }
  }

  saveSettings() {
    PluginUtilities.saveSettings(this.getName(), this.settings);
  }

  loadSettings() {
    this.settings = PluginUtilities.loadSettings(this.getName(), this.defaultSettings);
  }

  resetSettings(panel) {
    this.settings = this.defaultSettings;
    this.saveSettings();
    panel.empty();
    this.generateSettings(panel);
    PluginUtilities.showToast("Settings reset to default");
  }

  getSettingsPanel() {
    let panel = $("<form>").css("width", "100%");
    this.generateSettings(panel);
    return panel[0];
  }

  generateSettings(panel) {
    let self = this;
    const defaultForm =
      `<div class="ui-form-item flexChild-1KGW5q">
        <h5 class="h5 h5-18_1nd"></h5>
        <div class="description"></div>
      </div>`;
    panel.append(
      $(defaultForm)
        .css('padding-top', '10px')
        .find('.h5')
        .toggleClass('title-3sZWYQ size12-3R0845 height16-2Lv3qA weightSemiBold-NJexzi defaultMarginh5-2mL-bP marginBottom8-AtZOdT')
        .html('Preview Size')
        .parent()
        .find('.description')
        .html('The size, in pixels, of the color preview pop-up')
        .toggleClass('description-3_Ncsb formText-3fs7AJ marginBottom8-AtZOdT modeDefault-3a2Ph1 primary-jw0I4K')
        .append(
          $(`<input class="inputDefault-_djjkz input-cIJ7To size16-14cGz5" id="hexPreview-size" type="number" value="${self.settings.previewSize}" />`)
            .on("input", (e) => {
              self.settings.previewSize = Number(e.target.value);
            })
        )
        .parent(),
      $(defaultForm)
        .css('padding-top', '10px')
        .find('.h5')
        .toggleClass('title-3sZWYQ size12-3R0845 height16-2Lv3qA weightSemiBold-NJexzi defaultMarginh5-2mL-bP marginBottom8-AtZOdT')
        .html('Text as Color')
        .parent()
        .find('.description')
        .html('Make the text the color of its own hex value')
        .toggleClass('description-3_Ncsb formText-3fs7AJ marginBottom8-AtZOdT modeDefault-3a2Ph1 primary-jw0I4K')
        .append(
          new PluginSettings.Checkbox('Text as Color', 'Make the text the color of its own hex value', this.settings.textColor, value => {
            this.settings.textColor = value;
          }).getElement().find('.input-wrapper')
        )
        .parent(),
      $(defaultForm)
        .css('padding-top', '10px')
        .find('.h5')
        .toggleClass('title-3sZWYQ size12-3R0845 height16-2Lv3qA weightSemiBold-NJexzi defaultMarginh5-2mL-bP marginBottom8-AtZOdT')
        .html('Show Preview')
        .parent()
        .find('.description')
        .html('Show the pop-up preview')
        .toggleClass('description-3_Ncsb formText-3fs7AJ marginBottom8-AtZOdT modeDefault-3a2Ph1 primary-jw0I4K')
        .append(
          new PluginSettings.Checkbox('Show Preview', 'Show the pop-up preview', this.settings.previewPopup, value => {
            this.settings.previewPopup = value;
          }).getElement().find('.input-wrapper')
        )
        .parent(),
      $(defaultForm)
        .css('padding-top', '10px')
        .find('.h5')
        .toggleClass('title-3sZWYQ size12-3R0845 height16-2Lv3qA weightSemiBold-NJexzi defaultMarginh5-2mL-bP marginBottom8-AtZOdT')
        .html('Save Settings')
        .parent()
        .find('.description')
        .html('Update the settings to test them without saving')
        .toggleClass('description-3_Ncsb formText-3fs7AJ marginBottom8-AtZOdT modeDefault-3a2Ph1 primary-jw0I4K')
        .append(
          $(`<button type="button">`)
            .toggleClass('button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN')
            .html('Update')
            .click(() => {
              self.cleanUp();
              self.wrapAll();
              self.updateStyle();
              PluginUtilities.showToast('Settings updated!');
            })
        )
        .parent(),
      $(defaultForm)
        .css('padding-top', '5px')
        .find('.description')
        .html('Save settings and update them')
        .toggleClass('description-3_Ncsb formText-3fs7AJ marginBottom8-AtZOdT modeDefault-3a2Ph1 primary-jw0I4K')
        .append(
          $(`<button type="button">`)
            .toggleClass('button-1x2ahC button-38aScr lookFilled-1Gx00P colorGreen-29iAKY sizeSmall-2cSMqn grow-q77ONN')
            .html('Save & Update')
            .click(() => {
              self.cleanUp();
              self.wrapAll();
              self.updateStyle();
              self.saveSettings();
              PluginUtilities.showToast('Settings saved and updated!');
            })
        )
        .parent(),
      $(defaultForm)
        .css('padding-top', '10px')
        .append(
          $(`<button type="button">`)
            .toggleClass('button-38aScr lookFilled-1Gx00P colorRed-1TFJan sizeMedium-1AC_Sl grow-q77ONN')
            .css({
              'margin': '0 auto'
            })
            .html("Reset Settings")
            .click(() => this.resetSettings(panel))
        )
    );
  }

  getName        () { return "Hex Color Preview"; }
  getDescription () { return "Hover over hex colors to get a popup preview of that color. Makes discussing colors much easier."; }
  getVersion     () { return "0.2.1"; }
  getAuthor      () { return "kaloncpu57"; }
  load() { }
  stop() { this.cleanUp(); }
  unload() { this.cleanUp(); }

}
