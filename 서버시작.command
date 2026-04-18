#!/bin/bash
cd "$(dirname "$0")/www"
echo "-----------------------------------"
echo " Project Tracker 서버 시작 중..."
echo "-----------------------------------"

# 포트 8282가 이미 사용 중이면 종료
lsof -ti:8282 | xargs kill -9 2>/dev/null

# 브라우저 열기 (1초 후)
sleep 1 && open http://localhost:8282 &

echo " 브라우저가 자동으로 열립니다."
echo " 종료하려면 이 창을 닫으세요."
echo "-----------------------------------"

# Python3 서버 시작
python3 -m http.server 8282
