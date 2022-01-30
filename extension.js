const vscode = require("vscode");

function activate(context) {
  // console.log("Document-jumper is now active");

  let jumpForwardCommand = vscode.commands.registerCommand(
    "jumpForward",
    jumpForward
  );
  let jumpBackwardCommand = vscode.commands.registerCommand(
    "jumpBackward",
    jumpBackward
  );

  context.subscriptions.push(jumpForwardCommand);
  context.subscriptions.push(jumpBackwardCommand);
}

function deactivate() {}
module.exports = {
  activate,
  deactivate,
};

// function shouldTab() {
//   let editor = vscode.window.activeTextEditor;
//   let lineNumber = editor.selection.active.line;
//   let pos = editor.selection.active.character;

//   if (pos >= 0) {
//     var beforeRange = new vscode.Range(
//       new vscode.Position(lineNumber, 0),
//       new vscode.Position(lineNumber, pos)
//     );
//     var beforeText = editor.document.getText(beforeRange);
//     if (beforeText.trim() == "") {
//       console.log("Tab");
//       return true;
//     }
//   }
//   return false;
// }

function jumpForward() {
  let editor = vscode.window.activeTextEditor;
  let lineNumber = editor.selection.active.line;
  let lineText = editor.document.lineAt(lineNumber).text;
  let cursorIndex = editor.selection.active.character;
  let pos = new vscode.Position(lineNumber, cursorIndex);

  if (!editor) return;
  let nextPos = pos;
  var afterRange = new vscode.Range(
    pos,
    new vscode.Position(lineNumber, lineText.length)
  );
  var afterText = editor.document.getText(afterRange);

  for (let element of afterText) {
    if (!element.match(/^[0-9a-zA-Z]+$/)) {
      let elementIndex = afterText.indexOf(element);
      // console.log("found:", element, "index", elementIndex);
      if (elementIndex == 0) {
        if (element == " ") {
          while (afterText.charAt(cursorIndex + 1) == " ") cursorIndex++;
        }
        cursorIndex = cursorIndex + 1;
      } else {
        cursorIndex = elementIndex + (lineText.length - afterText.length);
      }
      nextPos = new vscode.Position(lineNumber, cursorIndex);
      break;
    }
  }
  if (nextPos == pos) {
    nextPos = new vscode.Position(lineNumber + 1, 0);
  }

  return (vscode.window.activeTextEditor.selection = new vscode.Selection(
    nextPos,
    nextPos
  ));
}
function jumpBackward() {
  let editor = vscode.window.activeTextEditor;
  let lineNumber = editor.selection.active.line;
  let cursorIndex = editor.selection.active.character;
  let pos = new vscode.Position(lineNumber, cursorIndex);

  if (!editor) return;
  let nextPos = pos;
  var beforeRange = new vscode.Range(new vscode.Position(lineNumber, 0), pos);
  var beforeText = editor.document.getText(beforeRange);

  for (let i = beforeText.length - 1; i >= 0; i--) {
    let element = beforeText.charAt(i);
    if (!element.match(/^[0-9a-zA-Z]+$/)) {
      let elementIndex = i;
      // console.log("found:", element, "index", elementIndex);
      // console.log("CursorIndex: ", cursorIndex);
      if (elementIndex + 1 == cursorIndex) {
        if (element == " ") {
          while (beforeText.charAt(cursorIndex - 1) == " ") cursorIndex--;
        } else cursorIndex--;
      } else {
        cursorIndex = elementIndex + 1;
      }

      nextPos = new vscode.Position(lineNumber, cursorIndex);
      break;
    }
  }
  if (nextPos == pos) {
    nextPos = new vscode.Position(
      lineNumber - 1,
      editor.document.lineAt(lineNumber - 1).text.length
    );
  }

  return (vscode.window.activeTextEditor.selection = new vscode.Selection(
    nextPos,
    nextPos
  ));
}
