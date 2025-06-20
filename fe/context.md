{
  "framework": "React",
  "uiLibrary": "Chakra UI",
  "stateManagement": "Zustand",
  "design": {
    "style": "glamorphism",
    "colors": {
      "primary": "#749C73",
      "secondary": "#FFFFFF",
      "black": "#444444"
    },
    "cornerRadius": {
      "default": 20,
      "buttonAndInput": "full"
    },
    "effects": {
      "shadow": "soft",
      "glass": true,
      "popUp": {
        "backgroundBlur": true
      }
    },
    "animationLibrary": "framer-motion",
    "iconLibrary": "lucide-react",
    "defaultAnimation": {
      "initial": { "opacity": 0 },
      "animate": { "opacity": 1, "transition": { "duration": 0.5 } },
      "exit": { "opacity": 0, "transition": { "duration": 0.5 } }
    }
  },
  "folderStructure": {
    "src": {
      "assets": {},
      "components": {
        "common": {
          "Button": {
            "file": "Button.js",
            "animation": {
              "initial": { "scale": 0.9 },
              "animate": { "scale": 1, "transition": { "duration": 0.3 } }
            }
          },
          "Input": {
            "file": "Input.js",
            "animation": {
              "initial": { "scale": 0.9 },
              "animate": { "scale": 1, "transition": { "duration": 0.3 } }
            }
          },
          "Card": {
            "file": "Card.js",
            "animation": {
              "initial": { "y": 50, "opacity": 0 },
              "animate": { "y": 0, "opacity": 1, "transition": { "duration": 0.5 } },
              "exit": { "y": -50, "opacity": 0, "transition": { "duration": 0.3 } }
            }
          }
        },
        "layout": {
          "Header": {
            "file": "Header.js",
            "animation": {
              "initial": { "x": -100, "opacity": 0 },
              "animate": { "x": 0, "opacity": 1, "transition": { "duration": 0.4 } }
            }
          },
          "Sidebar": {
            "file": "Sidebar.js",
            "animation": {
              "initial": { "x": -200, "opacity": 0 },
              "animate": { "x": 0, "opacity": 1, "transition": { "duration": 0.4 } }
            }
          }
        },
        "pages": {
          "Home": {
            "file": "Home.js",
            "animation": {
              "initial": { "y": 50, "opacity": 0 },
              "animate": { "y": 0, "opacity": 1, "transition": { "duration": 0.5 } }
            }
          },
          "Login": {
            "file": "Login.js",
            "animation": {
              "initial": { "y": 50, "opacity": 0 },
              "animate": { "y": 0, "opacity": 1, "transition": { "duration": 0.5 } }
            }
          }
        }
      },
      "routes": {
        "index.js": "Main router file with route definitions"
      },
      "services": {
        "api": {
          "auth": "authService.js",
          "user": "userService.js"
        }
      },
      "utils": {
        "helpers": "helpers.js",
        "validators": "validators.js"
      }
    }
  },
  "codingStandards": {
    "variableNaming": {
      "camelCase": true
    },
    "designPrinciples": {
      "modularDesign": true,
      "avoidOverengineering": true,
      "KISS": true,
      "DRY": true,
      "YAGNI": true,
      "noSpaghettiCode": true
    },
    "UI/UX": {
      "cardDesign": {
        "transparency": true,
        "glassEffect": true,
        "glamorphism": true
      },
      "useToasterForResponseMessage": true
    },
    "routing": {
      "protectRouteBasedOnToken": true
    },
    "codeOrganization": {
      "useHOC": true
    },
    "codeRules": {
      "modularization": {
        "limitStateLifting": "Lift state only when necessary to avoid passing down too many props.",
        "separateBusinessLogic": "Business logic should be separated into services or hooks, not inside components.",
        "useReusableComponents": "Create reusable components for UI elements like buttons, inputs, cards to avoid repetition."
      },
      "noSpaghettiCode": {
        "avoidDeepNesting": "Avoid deeply nested components, if possible, and break down complex components into smaller reusable pieces.",
        "singleResponsibility": "Each component should only have one responsibility. If a component does too many things, split it into smaller ones.",
        "clearCodeFlow": "Maintain clear and readable code flow. Avoid functions or methods that perform multiple, unrelated tasks."
      },
      "noDocumentationInCode": {
        "noInlineComments": "Do not include inline comments within the code files.",
        "noFunctionDocstrings": "Avoid adding documentation or docstrings inside functions or methods."
      }
    }
  }
}
