<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="true"
      @close="dialogConfig.show = false"
      width="55%"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="电子书名" prop="bookName">
          <el-input v-model="formData.bookName" :maxLength="20"></el-input>
        </el-form-item>
        <!-- 所属栏目 -->
        <el-form-item label="栏目" prop="columnId">
          <el-cascader
            placeholder="请选择栏目"
            :options="columnList"
            :props="columnProps"
            clearable
            v-model="formData.columnId"
            :style="{ width: '100%' }"
            @change="handleColSelect"
          />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item v-if="!formData.bookUrl" label="PDF文件" prop="bookFile">
          <FileSelector v-model="formData.bookFile"></FileSelector>
        </el-form-item>
        <el-form-item v-else label="地址">
          <!-- <span>{{ proxy.globalInfo.bookUrl + formData.bookUrl }}</span> -->
          <router-link
            target="_blank"
            :to="proxy.globalInfo.bookUrl + formData.bookUrl"
            >去预览</router-link
          >
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input
            clearable
            placeholder="提示信息"
            type="textarea"
            :rows="5"
            :maxlength="200"
            resize="none"
            show-word-limit
            v-model="formData.summary"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import FileSelector from "@/components/FileSelector.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadColumn: "/content/columnList",
  postBook: "/post/postBook",
};

const dialogConfig = ref({
  show: false,
  title: "新增电子书",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  bookName: [{ required: true, message: "请输入书名" }],
  columnId: [{ required: true, message: "请选择所属栏目" }],
  // cover: [{ required: true, message: "请上传封面" }],
  // summary: [{ required: true, message: "请输入摘要" }],
};

const showEdit = (data) => {
  dialogConfig.value.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (data.bookId == null) {
      dialogConfig.value.title = "新增电子书";
      formData.value = {};
    } else {
      dialogConfig.value.title = "修改电子书";
      formData.value = Object.assign({}, data);
      if (data.cover) {
        // 设置封面
        formData.value.cover = data.cover ? { imageUrl: data.cover } : "";
      }
    }
  });
};

defineExpose({
  showEdit,
});

const emit = defineEmits(["reload"]);
const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    delete params.postTime;
    // 封面
    if (!(params.cover instanceof File)) {
      delete params.cover;
    }
    // pdf文件
    if (!(params.bookFile instanceof File)) {
      delete params.bookFile;
    }
    // return console.log(params);
    let result = await proxy.Request({
      url: api.postBook,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.value.show = false;
    proxy.Message.success("保存成功!");
    emit("reload");
  });
};

//栏目信息
const columnProps = {
  multiple: false,
  checkStrictly: true,
  value: "columnId",
  label: "columnName",
};
const columnList = ref([]);
const loadColumnList = async () => {
  let result = await proxy.Request({
    url: api.loadColumn,
  });
  if (!result) {
    return;
  }
  columnList.value = result.data;
};
loadColumnList();

// 栏目选择器
const handleColSelect = (e) => {
  formData.value.columnId = e[e.length - 1];
};
</script>

<style lang="scss" scoped>
.check-span-item {
  float: left;
  margin-right: 10px;
  line-height: 20px;
}
</style>
