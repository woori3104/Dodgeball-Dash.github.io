# Dodgeball-Dash

## 기능

게임은 캔버스를 통해 시각적으로 표시됩니다.
공, 고양이, 강아지, 배경 이미지를 비동기적으로 로드합니다.
난이도 레벨을 표시하고, 난이도 버튼을 통해 변경할 수 있습니다.
이동 버튼을 사용하여 강아지를 움직일 수 있습니다.
일시정지 버튼을 클릭하여 게임을 일시정지하거나 재개할 수 있습니다.
리셋 버튼을 클릭하여 게임을 재시작할 수 있습니다.
음악 버튼을 클릭하여 배경 음악을 재생하거나 정지할 수 있습니다.
파워 버튼을 누르고 있으면 공에 효과를 주어 다른 각도로 튀게 할 수 있습니다.
충돌 감지를 통해 공이 고양이나 강아지와 충돌했는지 확인합니다.
점수를 추적하여 공이 경계에 닿을 때마다 강아지 또는 고양이의 점수를 업데이트합니다.

## 코드의 간략한 설명
코드는 게임 상태, 점수, 캔버스, 이미지 등을 추적하기 위해 여러 변수와 상수를 정의합니다.
- loadImage 함수
  - 이미지를 비동기적으로 로드하고 프로미스를 반환하는 유틸리티 함수입니다.

- init 함수
  - loadImage 함수를 사용하여 게임 이미지를 비동기적으로 로드하고 해당 이미지를 객체로 반환합니다.

- drawDifficulty 함수
  - 현재 난이도 레벨을 캔버스에 그리는 역할을 합니다.

- handelEndGame 함수
  - 공이 캔버스의 경계에 도달했는지 확인하고 점수를 업데이트합니다. 또한 resetPositions 함수를 호출하여 공과 동물의 위치를 초기값으로 재설정합니다.

- resetPositions 함수
  - 위치와 기타 변수를 초기값으로 재설정합니다.

- render 함수
  - 캔버스에 게임 요소(배경, 공, 고양이, 강아지, 점수 등)를 그리는 역할을 합니다.

- moveState 객체
  - 사용자 입력에 따라 움직임 상태(위, 아래, 왼쪽, 오른쪽)를 추적합니다.

- isBallCollision 함수
  - 공이 객체(고양이 또는 강아지)와 충돌했는지 위치와 크기를 기반으로 확인합니다.

- randomizeBallAngle 함수
  - 공의 움직임을 위해 랜덤한 각도를 생성합니다.

- updateBallCoordinates 함수
  - 공의 위치를 속도에 따라 업데이트하고 고양이와 강아지와의 충돌을 확인합니다.

- difficulty 변수
  - 게임의 난이도 레벨을 추적합니다.

- catMovement 함수
  - 고양이의 위치를 공과의 거리에 따라 업데이트합니다.

- handleDifficulty 함수
  - 난이도 버튼이 클릭되거나 터치될 때 이벤트를 처리하고 난이도 레벨을 업데이트합니다.

- isGamePaused 변수
  - 게임이 일시정지되었는지 여부를 추적합니다.

- handlePauseEvent 함수
  - 일시정지 버튼의 클릭 또는 터치 이벤트를 처리하고 게임을 일시정지 또는 재개합니다.

- setupMoveEvent 함수
  - 이동 버튼(위, 아래, 왼쪽, 오른쪽)의 클릭 또는 터치 이벤트를 처리하고 사용자 입력에 따라 움직임 상태를 업데이트합니다

## 추가 대응 예정 
- Power버튼을 누르면서 공에 부딪쳤을때 공의 속도를 증가하고 이펙트를 추가 
  - 현재 버튼을 누르면 공에 부딪치지않아도 이펙트가 표기되는 현상이 존재. 

# Dodgeball-Dash
## 機能
このコードは、ゲームの状態、スコア、キャンバス、画像などを追跡するための多くの変数や定数を定義します。
キャンバスを通じてゲームが視覚的に表示されます。
画像を非同期でロードします。ロードが完了したらPromiseを返します。
難易度レベルを表示し、難易度ボタンで変更できます。
移動ボタンを使用して犬を移動させることができます。
一時停止ボタンをクリックするとゲームを一時停止または再開できます。
リセットボタンをクリックするとゲームをリセットして再開できます。
音楽ボタンをクリックすると背景音楽を再生または停止できます。
パワーボタンを押している間、ボールに効果を与えて異なる角度で跳ね返るようにできます。
衝突検出により、ボールが猫や犬と衝突したかどうかを確認します。
スコアを追跡し、ボールが境界に触れるたびに犬または猫のスコアを更新します。

## コードの概要
- コードは、ゲームの状態、スコア、キャンバス、画像などを追跡するために複数の変数と定数を定義します。

- loadImage
  - 画像を非同期でロードし、Promiseを返すユーティリティ関数です。

- init
  - loadImage 関数を使用してゲームの画像を非同期でロードし、その画像をオブジェクトとして返します。

- drawDifficulty
  - 現在の難易度レベルをキャンバスに描画する役割を果たします。

- handelEndGame
  - ボールがキャンバスの境界に到達したかどうかを確認し、スコアを更新します。また、resetPositions 関数を呼び出してボールと動物の位置を初期値にリセットします。

- resetPositions
  - 位置とその他の変数を初期値にリセットします。

- render
  - キャンバスにゲームの要素（背景、ボール、猫、犬、スコアなど）を描画する役割を果たします。

- moveState
  - ユーザーの入力に応じて移動状態（上、下、左、右）を追跡します。

- isBallCollision
  - 位置とサイズに基づいて、ボールがオブジェクト（猫または犬）と衝突したかどうかを確認します。

- randomizeBallAngle
  - ボールの動きのためにランダムな角度を生成します。

- updateBallCoordinates
  - 速度に応じてボールの位置を更新し、猫や犬との衝突を確認します。

- difficulty
  - ゲームの難易度レベルを追跡します。

- catMovement
  - 猫の位置をボールとの距離に基づいて更新します。

- handleDifficulty
  - 難易度ボタンがクリックまたはタッチされたときのイベントを処理し、難易度レベルを更新します。

- isGamePaused
  - ゲームが一時停止されているかどうかを追跡します。

- handlePauseEvent
  - 一時停止ボタンのクリックまたはタッチイベントを処理し、ゲームを一時停止または再開します。

- setupMoveEvent
  - 移動ボタン（上、下、左、右）のクリックまたはタッチイベントを処理し、ユーザーの入力に応じて移動状態を更新します。


## 今後の予定
- パワーボタンを押しながらボールに当たった場合、ボールの速度を増加させ、エフェクトを追加します。
  - 現在、ボタンを押していない状態でもボールに当たった場合にエフェクトが表示される現象が存在しています。

