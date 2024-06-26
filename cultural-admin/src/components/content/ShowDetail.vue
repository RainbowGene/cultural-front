<template>
  <div>
    <Window :show="showWindow" @close="closeWindow">
      <div class="show-detail">
        <div class="iconfont icon-prev" @click="nextAndPre(-1)"></div>
        <div class="content-info">
          <div class="header">
            {{ articleTitle[props.showType] }}
          </div>
          <div class="content">
            <div class="title">{{ detailInfo.title }}</div>
            <div class="detail-info">
              <div class="dif">
                难度:
                <el-rate
                  v-model="detailInfo.difficultyLevel"
                  :disabled="true"
                ></el-rate>
              </div>
            </div>
            <div class="fs-12">更新于 - {{ detailInfo.createTime }}</div>
            <div class="part-title">问题描述</div>
            <div
              class="html-content"
              v-html="detailInfo.question || '暂无描述'"
            ></div>
            <!-- 考题/题目选项 -->
            <template v-if="props.showType == 2">
              <div class="part-title">
                题目类型:{{ QUESTION_TYPE[detailInfo.questionType] }}
              </div>
              <!-- 单选题显示选项 -->
              <template v-if="detailInfo.questionType == 1">
                <div class="part-title">问题选项</div>
                <div
                  class="question-item"
                  v-for="(item, index) in detailInfo.questionItemList"
                >
                  <div
                    :class="
                      detailInfo.questionAnswer == index ? 't-green' : 't-gray'
                    "
                  >
                    {{ LETTER[index] }}、{{ item.title }}
                  </div>
                </div>
              </template>
              <!-- 多选选题显示选项 -->
              <template v-if="detailInfo.questionType == 2">
                <div class="part-title">问题选项</div>
                <div
                  class="question-item"
                  v-for="(item, index) in detailInfo.questionItemList"
                >
                  <div
                    :class="
                      detailInfo.questionAnswer.split(',')[index] != null
                        ? 't-green'
                        : 't-gray'
                    "
                  >
                    {{ LETTER[index] }}、{{ item.title }}
                  </div>
                </div>
              </template>
              <div class="part-title">
                答案：
                <template v-if="detailInfo.questionType == 0">
                  <span
                    :class="
                      detailInfo.questionAnswer == '0' ? 't-red' : 't-green'
                    "
                  >
                    {{ detailInfo.questionAnswer == "0" ? "错误" : "正确" }}
                  </span>
                </template>
                <template v-else>
                  <span
                    class="mr-s"
                    v-if="detailInfo.questionAnswer"
                    v-for="item in detailInfo.questionAnswer.split(',')"
                  >
                    {{ LETTER[Number.parseInt(item)] }}
                  </span>
                </template>
              </div>
            </template>
            <div class="part-title">答案解析:</div>
            <div class="html-content" v-html="detailInfo.answerAnalysis"></div>
          </div>
        </div>
        <div class="iconfont icon-next1" @click="nextAndPre(1)"></div>
      </div>
    </Window>
  </div>
</template>

<script setup>
import { QUESTION_TYPE, LETTER } from "@/utils/Constants";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  showType: {
    type: Number, // 1八股文 2考题 3分享
    default: 1,
  },
});

const articleTitle = ref({
  1: "问题详情",
  2: "考题详情",
  3: "分享详情",
});
const showWindow = ref(false);
const closeWindow = () => {
  showWindow.value = false;
  window.removeEventListener("keyup", keyHandler, false); // 移除绑定键盘事件
};
const showDetail = (id, params) => {
  showWindow.value = true;
  searchParams.value = params;
  currentId.value = id;
  nextType.value = null;
  getDetail();
  window.addEventListener("keyup", keyHandler, false); // 绑定键盘事件
};

defineExpose({
  showDetail,
});

const api = {
  showType1: "questionInfo/showQuestionDetailNext",
  showType2: "examQuestion/showExamQuestionDetailNext",
  showType3: "shareInfo/showShareDetailNext",
};

const searchParams = ref({});
const currentId = ref(); // 当前展示项id
const nextType = ref(); // 是上还是下

const detailInfo = ref({});
const getDetail = async () => {
  const params = Object.assign({}, searchParams.value);
  params.nextType = nextType.value;
  params.currentId = currentId.value;
  let result = await proxy.Request({
    url: api["showType" + props.showType],
    params: params,
  });
  if (!result) {
    return;
  }
  let resultData = result.data;
  detailInfo.value = resultData;
  // console.log(detailInfo.value);
  if (props.showType == 3) {
    currentId.value = resultData.shareId;
  } else {
    currentId.value = resultData.questionId;
  }
};

// 上/下翻文
const nextAndPre = (type) => {
  nextType.value = type;
  getDetail();
};

const keyHandler = (event) => {
  // 监听键盘 左右键
  const e = event || window.event || arguments.callee.caller.arguments[0];
  let key = e.keyCode;
  if (key == 39) {
    nextAndPre(1);
  } else if (key == 37) {
    nextAndPre(-1);
  }
};
</script>

<style lang="scss" scoped>
.show-detail {
  height: calc(100vh);
  display: flex;
  justify-content: center;
  align-items: center;
  .content-info {
    width: 240px;
    height: 486px;
    background: url(@/assets/phone.png);
    background-color: #fff;
    background-position-x: -1px;
    border-radius: 30px;
    padding: 52px 16px 35px 19px;
    .header {
      background: #dad9d9;
      font-size: 18px;
      line-height: 30px;
      text-align: center;
      border-radius: 5px 5px 0px 0px;
    }
    .content {
      height: 380px;
      overflow: auto;
      padding: 10px;
      .title {
        font-weight: bold;
        font-size: 15px;
      }
      .detail-info {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #878787;
        justify-content: space-between;
        .dif {
          display: flex;
          align-items: center;
        }
      }
      .part-title {
        margin-top: 10px;
        font-weight: bold;
        border-left: 3px solid #02baf8;
        padding-left: 5px;
      }
      .html-content {
        margin-top: 10px;

        :deep(code) {
          word-break: break-all;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        :deep(img) {
          max-width: 100%;
        }
      }
      .question-item-list {
        margin-top: 10px;
        padding-left: 10px;
        .question-item {
          margin-top: 5px;
        }
      }
    }
  }
  .iconfont {
    font-size: 50px;
    color: #97def6;
    cursor: pointer;
  }
  .icon-pre {
    margin-right: 20px;
  }
  .icon-next {
    margin-left: 20px;
  }
}
</style>
