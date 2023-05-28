import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider: vscode.InlayHintsProvider = {
    provideInlayHints: async (model, iRange, cancel) => {
      const offset = model.offsetAt(iRange.start);
      const text = model.getText(iRange);
      console.log("text", text);
      const results: vscode.InlayHint[] = [];

      const ethersProviderPattern = /ethers\.providers\.Web3Provider/g;
      const ethSendTransactionPattern = /eth_sendTransaction/g;

      const ethersProviderMatches = [...text.matchAll(ethersProviderPattern)];
      const ethSendTransactionMatches = [
        ...text.matchAll(ethSendTransactionPattern),
      ];

      if (cancel.isCancellationRequested) {
        return [];
      }

      for (const match of ethersProviderMatches) {
        results.push(
          createInlayHint(
            "Consider using Biconomy SDK instead of ethers provider",
            match.index,
            offset,
            model
          )
        );
      }

      for (const match of ethSendTransactionMatches) {
        results.push(
          createInlayHint(
            "Consider using Biconomy SDK for gasless transactions",
            match.index,
            offset,
            model
          )
        );
      }

      return results;
    },
  };

  context.subscriptions.push(
    vscode.languages.registerInlayHintsProvider(
      [
        { language: "javascript" },
        { language: "typescript" },
        { language: "typescriptreact" },
        { language: "javascriptreact" },
      ],
      provider
    )
  );
}

export function deactivate() {}

function createInlayHint(
  message: string,
  matchIndex: number,
  offset: number,
  model: vscode.TextDocument
): vscode.InlayHint {
  const startPos = model.positionAt(matchIndex + offset);
  const endPos = model.positionAt(matchIndex + offset + message.length);
  const position = new vscode.Position(startPos.line, endPos.character);
  return {
    kind: vscode.InlayHintKind.Other,
    position: position,
    label: message,
    whitespaceBefore: true,
  };
}
